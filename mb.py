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

with open("ids_artist.json") as f:
    ids_artist = json.load(f)

# TODO: replace this txt file with the chunk you are running
# make sure you don't have any files named "records_incremental.json"
# or "collabs_incremental.json"
with open("artists_sonja.txt") as f:
    rappers = f.read().splitlines()

musicbrainzngs.set_useragent("Example music app", "0.1", "http://example.com/music")

# store urls here so we don't have to query if we already have it
# release_id -> cover_url
release_art = {}

records_json = {}
collabs_json = {}

def printOutCollabDictionary(filename):
    json.dump(collabs_json, open(filename, 'w'), indent=2, separators=(',', ': '))

def writeArtistCollabs(name, artist_collabs):
    with open("collabs_incremental.json", "a") as outfile:
        outfile.write("\"" + name + "\": ");
        json.dump(artist_collabs, outfile, indent=2, separators=(',', ': ')) 
        outfile.write(",\n")

def getCoverArt(release_id):
    if release_id in release_art:
        return release_art[release_id]
    try:
        images = caa.get_image_list(str(release_id))
    except:
        # there was no cover art :(
        return None
       
    # throttle the calls, we are rate limited to ~50 a minute
    time.sleep(1.3)
    cover_url = None
    for image in images["images"]:
        if "Front" in image["types"] and image["approved"]:
            cover_url = image["thumbnails"]["small"]
            break
    release_art[release_id] = cover_url
    return cover_url

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
            add = False
            
            #verify that only collaborator isnt the artist themself
            # #lol
            collaborating_artists = []
            collaborating_artists.append(name)
            collaborating_artists_in_list = []
            collabs = [collab for collab in collabs if len(collab) == 1 and "artist" in collab and "id" in collab["artist"] and collab["artist"]["id"] != id]
            for collab in collabs:
                alias = []
                if "artist" not in collab:
                    continue
                if "id" not in collab["artist"] or "name" not in collab["artist"]:
                    continue
                if collab["artist"]["id"] in ids_artist.keys():
                    add = True
                    # this ensures we have the same name as what's in our list
                    collaborating_artists.append(ids_artist[collab["artist"]["id"]])
                    # this is the list to loop over later to add the information for
                    collaborating_artists_in_list.append(ids_artist[collab["artist"]["id"]])
                else:
                    collaborating_artists.append(collab["artist"]["name"])
            if add:
                total_records.append(rec)
                record_json = {
                    "id" : rec["id"],
                    "title" : rec["title"],
                    "artist_credit" : collaborating_artists,
                    "release_id" : rel["id"],
                    "release_title" : rel["title"],
                    "release_year" : rel["date"].split("-")[0],
                    "cover_url" : getCoverArt(rel["id"]),
                }
                for collaborating_artist in collaborating_artists_in_list:
                    if collaborating_artist not in artist_tuples:
                        artist_tuples[collaborating_artist] = []
                    artist_tuples[collaborating_artist].append(record_json)

        time.sleep(1.3)

    # note: json can't serialize tuples
    # {curr_artist -> {collab_artist -> {record_id -> record_title}}}
    final_collabs = {}
    for k,v in artist_tuples.iteritems():
        final_collabs[str(k)] = v
    writeArtistCollabs(name, final_collabs)
    collabs_json[name] = final_collabs
printOutCollabDictionary("collabs.json")


