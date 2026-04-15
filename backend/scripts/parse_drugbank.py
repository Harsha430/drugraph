# parse_drugbank.py
from lxml import etree
import csv, gzip, os

NS = "http://www.drugbank.ca"

def tag(name):
    return f"{{{NS}}}{name}"

def text(el, path):
    parts = path.split("/")
    cur = el
    for p in parts:
        cur = cur.find(tag(p))
        if cur is None:
            return ""
    return (cur.text or "").strip()

# Output CSV writers
drugs_f = open("drugs.csv", "w", newline="", encoding="utf-8")
interactions_f = open("interactions.csv", "w", newline="", encoding="utf-8")
categories_f = open("categories.csv", "w", newline="", encoding="utf-8")
targets_f = open("targets.csv", "w", newline="", encoding="utf-8")

drugs_w = csv.writer(drugs_f)
inter_w = csv.writer(interactions_f)
cat_w = csv.writer(categories_f)
tgt_w = csv.writer(targets_f)

drugs_w.writerow(["drugbank_id","name","description","state",
                  "indication","mechanism","half_life","groups"])
inter_w.writerow(["drug_a_id","drug_b_id","description"])
cat_w.writerow(["drugbank_id","category","mesh_id"])
tgt_w.writerow(["drugbank_id","target_id","target_name","actions","organism"])

count = 0
context = etree.iterparse("fulldb.xml", events=("end",), tag=tag("drug"))

for event, drug_el in context:
    # Only top-level drugs (not nested)
    if drug_el.getparent().tag != tag("drugbank"):
        drug_el.clear()
        continue

    # Primary ID
    db_id = ""
    for id_el in drug_el.findall(tag("drugbank-id")):
        if id_el.get("primary") == "true":
            db_id = id_el.text or ""
            break

    if not db_id:
        drug_el.clear()
        continue

    name = text(drug_el, "name")
    desc = text(drug_el, "description")
    state = text(drug_el, "state")
    indication = text(drug_el, "indication")
    mechanism = text(drug_el, "mechanism-of-action")
    half_life = text(drug_el, "half-life")

    groups = [g.text for g in drug_el.findall(f"{tag('groups')}/{tag('group')}") if g.text]
    groups_str = "|".join(groups)

    drugs_w.writerow([db_id, name, desc, state, indication, mechanism, half_life, groups_str])

    # Drug-drug interactions
    for di in drug_el.findall(f"{tag('drug-interactions')}/{tag('drug-interaction')}"):
        other_id_el = di.find(tag("drugbank-id"))
        other_id = other_id_el.text if other_id_el is not None else ""
        di_desc = text(di, "description")
        if other_id:
            inter_w.writerow([db_id, other_id, di_desc])

    # Categories
    for cat_el in drug_el.findall(f"{tag('categories')}/{tag('category')}"):
        cat_name = text(cat_el, "category")
        mesh_id = text(cat_el, "mesh-id")
        if cat_name:
            cat_w.writerow([db_id, cat_name, mesh_id])

    # Targets
    for tgt_el in drug_el.findall(f"{tag('targets')}/{tag('target')}"):
        tgt_id = text(tgt_el, "id")
        tgt_name = text(tgt_el, "name")
        organism = text(tgt_el, "organism")
        actions = "|".join(
            a.text for a in tgt_el.findall(f"{tag('actions')}/{tag('action')}") if a.text
        )
        tgt_w.writerow([db_id, tgt_id, tgt_name, actions, organism])

    drug_el.clear()  # FREE MEMORY — critical for 2.4GB file
    count += 1
    if count % 1000 == 0:
        print(f"Processed {count} drugs...")

for f in [drugs_f, interactions_f, categories_f, targets_f]:
    f.close()

print(f"Done. Total drugs: {count}")