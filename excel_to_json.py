import pandas as pd
import json

files = {
    'product-catalog.xlsx': 'product-catalog.json',
    'customer-master.xlsx': 'customer-master.json',
    'vat.xlsx': 'vat.json'
}

for xlsx_file, json_file in files.items():
    try:
        df = pd.read_excel(xlsx_file, engine='openpyxl').fillna('')
        records = df.to_dict(orient='records')
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
        print(f"✅ Converted: {xlsx_file} → {json_file}")
    except Exception as e:
        print(f"❌ Failed to convert {xlsx_file}: {e}")
