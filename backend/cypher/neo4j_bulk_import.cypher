// Copy CSVs into Neo4j import directory before running.
// Example local desktop: <neo4j-home>/import/drugs.csv

// Constraints
CREATE CONSTRAINT drug_id IF NOT EXISTS FOR (d:Drug) REQUIRE d.drugbank_id IS UNIQUE;
CREATE CONSTRAINT category_name IF NOT EXISTS FOR (c:Category) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT target_id IF NOT EXISTS FOR (t:Target) REQUIRE t.id IS UNIQUE;

// Search indexes (non-unique) for common lookup paths
CREATE INDEX drug_name IF NOT EXISTS FOR (d:Drug) ON (d.name);
CREATE INDEX interaction_desc IF NOT EXISTS FOR ()-[r:INTERACTS_WITH]-() ON (r.description);
CREATE INDEX target_name IF NOT EXISTS FOR (t:Target) ON (t.name);

// Load Drugs
LOAD CSV WITH HEADERS FROM 'file:///drugs.csv' AS row
CALL {
  WITH row
  MERGE (d:Drug {drugbank_id: row.drugbank_id})
  SET d.name = row.name,
      d.description = row.description,
      d.state = row.state,
      d.indication = row.indication,
      d.mechanism = row.mechanism,
      d.half_life = row.half_life,
      d.groups = CASE
        WHEN row.groups IS NULL OR trim(row.groups) = '' THEN []
        ELSE split(row.groups, '|')
      END
} IN TRANSACTIONS OF 1000 ROWS;

// Load Categories
LOAD CSV WITH HEADERS FROM 'file:///categories.csv' AS row
CALL {
  WITH row
  MATCH (d:Drug {drugbank_id: row.drugbank_id})
  MERGE (c:Category {name: row.category})
  SET c.mesh_id = row.mesh_id
  MERGE (d)-[:BELONGS_TO]->(c)
} IN TRANSACTIONS OF 1000 ROWS;

// Load Targets
LOAD CSV WITH HEADERS FROM 'file:///targets.csv' AS row
CALL {
  WITH row
  MATCH (d:Drug {drugbank_id: row.drugbank_id})
  MERGE (t:Target {id: row.target_id})
  SET t.name = row.target_name,
      t.organism = row.organism
  MERGE (d)-[r:TARGETS]->(t)
  SET r.actions = CASE
    WHEN row.actions IS NULL OR trim(row.actions) = '' THEN []
    ELSE split(row.actions, '|')
  END
} IN TRANSACTIONS OF 1000 ROWS;

// Load Interactions LAST
LOAD CSV WITH HEADERS FROM 'file:///interactions.csv' AS row
CALL {
  WITH row
  MATCH (a:Drug {drugbank_id: row.drug_a_id})
  MATCH (b:Drug {drugbank_id: row.drug_b_id})
  MERGE (a)-[r:INTERACTS_WITH]->(b)
  SET r.description = row.description
} IN TRANSACTIONS OF 2000 ROWS;

// Sanity checks
MATCH (d:Drug) RETURN count(d) AS drugs;
MATCH ()-[r:INTERACTS_WITH]->() RETURN count(r) AS interactions;
MATCH ()-[r:TARGETS]->() RETURN count(r) AS targets;
MATCH ()-[r:BELONGS_TO]->() RETURN count(r) AS categories;
