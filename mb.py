#from musicbrainzngs import *
import musicbrainzngs
import caa
import time
import pprint
import json
from collections import namedtuple

pp = pprint.PrettyPrinter(indent=2)

with open("artists.txt") as f:
    all_rappers = f.read().splitlines()

with open("artist_ids.json") as f:
    artist_ids = json.load(f)
# TODO: replace this txt file with the chunk you are running
# make sure you don't have any files named "records_incremental.json"
# or "collabs_incremental.json"
with open("artists_sonja.txt") as f:
    rappers = f.read().splitlines()

musicbrainzngs.set_useragent("Example music app", "0.1", "http://example.com/music")

records_json = {}
collabs_json = {}
def addRecord( rec_id, record_data ):
    records_json[rec_id] = record_data

def writeRecord( rec_id, record_data ):
    with open("records_incremental.json", "a") as outfile:
        outfile.write("\"" + rec_id + "\": ");
        json.dump(record_data, outfile, indent=2, separators=(',', ': '))
        outfile.write(",\n")

def printOutRecordDictionary(filename):
    json.dump(records_json, open(filename, 'w'), indent=2, separators=(',', ': '))

def printOutCollabDictionary(filename):
    json.dump(collabs_json, open(filename, 'w'), indent=2, separators=(',', ': '))

def writeArtistCollabs(name, artist_collabs):
    with open("collabs_incremental.json", "a") as outfile:
        outfile.write("\"" + name + "\": ");
        json.dump(artist_collabs, outfile, indent=2, separators=(',', ': ')) 
        outfile.write(",\n")

for name in rappers:
    id = artist_ids[name]
    print name
    print id

    offset = 0 # need to loop as we are limited to 100 results per call
    total_releases = []
    releases = musicbrainzngs.search_releases(arid=id, limit=100, offset=offset)['release-list']
    time.sleep(1.3) # throttle the calls, we are rate limited to ~50 a minute
    total_releases += releases
    while len(releases) == 100:
        offset += 100
        releases = musicbrainzngs.search_releases(arid=id, limit=100, offset=offset)['release-list']
        total_releases += releases
        time.sleep(1.3)
    title = {}
    for rel in total_releases:
        if rel["title"] not in title:
            title[rel["title"]] = []
        title[rel['title']].append(rel)

    correct_releases = []
    for k,v in title.iteritems():
        res = title[k]
        countries = []
        for r in res:
            if "country" in r and "date" in r:
                if r["country"] == "US" or r["country"] == "us" or r["country"] == "XW" or r["country"] == "xw":
                    countries.append(r)
        if len(countries) > 0:
            best = countries[0]
            min_date = int(countries[0]["date"].split("-")[0])
            for c in countries:
                year = int(c["date"].split("-")[0])
                if year < min_date:
                    min_date = year
                    best = c
            correct_releases.append(best)

    artist_tuples = {}

    total_records = []
    for rel in correct_releases:
        records = musicbrainzngs.search_recordings(reid=rel["id"], limit=100)['recording-list']
        for rec in records:
            if "artist-credit" not in rec:
                continue
            collabs = rec["artist-credit"]
            added = False
            
            #verify that only collaborator isnt the artist themself
            # #lol
            collabs = [collab for collab in collabs if len(collab) == 1 and "artist" in collab and "id" in collab["artist"] and collab["artist"]["id"] != id]
            for collab in collabs:
                if True:
                    alias = []
                    if "artist" not in collab:
                        continue
                    if "alias-list" in collab["artist"]:
                        alias = [namez["alias"] for namez in collab["artist"]["alias-list"]]
                    if "name" in collab["artist"]:
                        alias.append(collab["artist"]["name"])
                    for al in alias:
                        if al in all_rappers:
                            total_records.append(rec)
                            record_json = {"title": rec["title"], "release_id": rel["id"], "year": rel["date"].split("-")[0]}
                            addRecord(rec["id"], record_json)
                            writeRecord(rec["id"], record_json)
                            if al not in artist_tuples:
                                artist_tuples[al] = []
                            artist_tuples[al].append(rec["id"])
                            break

        time.sleep(1.3)

    Rap = namedtuple("Rap", ["ar1", "ar2"])

    # note: json can't serialize tuples
    # {curr_artist -> {collab_artist -> [record_ids]}}
    final_collabs = {}
    for k,v in artist_tuples.iteritems():
        #r = Rap(ar1=name, ar2=k)
        final_collabs[str(k)] = list(set(v))
    writeArtistCollabs(name, final_collabs)
    collabs_json[name] = final_collabs
printOutRecordDictionary("records.json")
printOutCollabDictionary("collabs.json")