import axios from 'axios';
import type { Drug, GraphData, Message, SearchRequest } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Search
  search: async (query: string, k: number = 5) => {
    const res = await client.post('/search', { query, k });
    return res.data.results as Drug[];
  },

  // Assistant / RAG
  ask: async (question: string) => {
    const res = await client.post('/ask', { question });
    return res.data; // { answer, graph_query, retrieved_context }
  },

  // Safety / Interactions
  checkInteractions: async (drugs: string[]) => {
    const res = await client.post('/check', { drugs });
    return res.data.interactions;
  },

  // Graph
  getGraph: async (limit: number = 200) => {
    const res = await client.get('/graph', { params: { limit } });
    return res.data as GraphData;
  },

  // Drug Details
  getDrugDetails: async (drugId: string) => {
    const res = await client.get(`/drug/${drugId}`);
    return res.data;
  },

  // Alternatives
  getAlternatives: async (drug: string, condition: string, currentMeds: string = '') => {
    const encodedDrug = encodeURIComponent(drug);
    const encodedCondition = encodeURIComponent(condition);
    const params = currentMeds ? { current_meds: currentMeds } : {};
    const res = await client.get(`/alternatives/${encodedDrug}/${encodedCondition}`, { params });
    return res.data;
  },
};
