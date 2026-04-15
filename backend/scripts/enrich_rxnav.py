import csv
import time

import requests


def get_rxcui(drug_name: str) -> str | None:
    response = requests.get(
        "https://rxnav.nlm.nih.gov/REST/rxcui.json",
        params={"name": drug_name, "search": 1},
        timeout=8,
    )
    response.raise_for_status()
    payload = response.json()
    ids = payload.get("idGroup", {}).get("rxnormId", [])
    return ids[0] if ids else None


def main(limit: int = 5000) -> None:
    drugs: list[tuple[str, str]] = []
    with open("drugs.csv", newline="", encoding="utf-8") as fp:
        for row in csv.DictReader(fp):
            drugs.append((row["drugbank_id"], row["name"]))

    with open("rxcui_map.csv", "w", newline="", encoding="utf-8") as out:
        writer = csv.writer(out)
        writer.writerow(["drugbank_id", "rxcui"])
        for db_id, name in drugs[:limit]:
            try:
                rxcui = get_rxcui(name)
                if rxcui:
                    writer.writerow([db_id, rxcui])
            except requests.RequestException:
                pass
            time.sleep(0.05)


if __name__ == "__main__":
    main()
