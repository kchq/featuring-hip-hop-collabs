import json

with open("artist_ids.json") as f:
  rappers = json.load(f)

reverse_rappers = {v: k for k, v in rappers.items()}

json.dump(reverse_rappers, open('ids_artist.json', 'w'), indent=2, separators=(',', ': '), sort_keys=True)