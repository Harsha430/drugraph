import os
import numpy as np
import onnxruntime as ort
from transformers import AutoTokenizer
from huggingface_hub import hf_hub_download
from typing import List
from langchain_core.embeddings import Embeddings

class ONNXEmbeddings(Embeddings):
    """
    Lightweight embedding class using ONNX Runtime for all-MiniLM-L6-v2.
    Replaces sentence-transformers to save ~800MB of RAM.
    """
    def __init__(self, model_id: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_id = model_id
        
        # Download tokenizer and ONNX model
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        
        # Download the ONNX model file specifically
        # Xenova's version is well-structured for ONNX
        onnx_path = hf_hub_download(
            repo_id="Xenova/all-MiniLM-L6-v2", 
            filename="onnx/model_quantized.onnx" # Use quantized for even less RAM
        )
        
        # Initialize ONNX session
        self.session = ort.InferenceSession(onnx_path)

    def _mean_pooling(self, model_output, attention_mask):
        token_embeddings = model_output[0]
        input_mask_expanded = np.expand_dims(attention_mask, -1).astype(float)
        sum_embeddings = np.sum(token_embeddings * input_mask_expanded, axis=1)
        sum_mask = np.clip(input_mask_expanded.sum(axis=1), a_min=1e-9, a_max=None)
        return sum_embeddings / sum_mask

    def _get_embeddings(self, texts: List[str]) -> List[List[float]]:
        # Tokenize
        encoded_input = self.tokenizer(
            texts, 
            padding=True, 
            truncation=True, 
            max_length=512,
            return_tensors='np'
        )
        
        # Prepare inputs for ONNX
        onnx_inputs = {
            "input_ids": encoded_input['input_ids'].astype(np.int64),
            "attention_mask": encoded_input['attention_mask'].astype(np.int64),
            "token_type_ids": encoded_input['token_type_ids'].astype(np.int64)
        }
        
        # Run inference
        model_output = self.session.run(None, onnx_inputs)
        
        # Pooling
        sentence_embeddings = self._mean_pooling(model_output, encoded_input['attention_mask'])
        
        # L2 Normalization
        norm = np.linalg.norm(sentence_embeddings, axis=1, keepdims=True)
        normalized_embeddings = sentence_embeddings / norm
        
        return normalized_embeddings.tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._get_embeddings(texts)

    def embed_query(self, text: str) -> List[float]:
        return self._get_embeddings([text])[0]
