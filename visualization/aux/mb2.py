import musicbrainzngs
import caa
import time
import json
from pprint import pprint

# adds a cover art url to each record. stores None if no art found 

with open('records.json') as f:
  records = json.load(f)

# store urls here so we don't have to query if we already have it
# release_id -> cover_url
release_art = {}

for k,v in records.iteritems():
  release_id = v["release_id"]
  if release_id in release_art:
    v["cover_url"] = release_art[release_id]
    break
  images = caa.get_image_list(v["release_id"])
  time.sleep(1.3) # throttle the calls, we are rate limited to ~50 a minute
  cover_url = None
  for image in images["images"]:
    if "Front" in image["types"] and image["approved"]:
      cover_url = image["thumbnails"]["small"]
      break
  release_art[release_id] = cover_url
  v["cover_url"] = cover_url

json.dump(records, open("records.json", 'w'), indent=2, separators=(',', ': '))