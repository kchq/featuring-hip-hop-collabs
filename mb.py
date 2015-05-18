#from musicbrainzngs import *
import musicbrainzngs
import time
import pprint
from collections import namedtuple

pp = pprint.PrettyPrinter(indent=2)
with open("artists.txt") as f:
    rappers = f.read().splitlines()

musicbrainzngs.set_useragent("Example music app", "0.1", "http://example.com/music")
#musicbrainzngs.set_hostname("echoprint.musicbrainz.org")

name = raw_input("Name: ")
result = musicbrainzngs.search_artists(artist=name)
if result is not None:
    id = result['artist-list'][0]['id']
print id

offset= 0
total_releases = []
releases = musicbrainzngs.search_releases(arid=id, limit=100, offset=offset)['release-list']
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
#pp.pprint(title["If You're Reading This It's Too Late"][0])


correct_releases = []
for k,v in title.iteritems():
    res = title[k]
    countries = []
    for r in res:
        if "country" in r and "date" in r:
            if r["country"] == "US" or r["country"] == "us":
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

#pp.pprint([t["title"] for t in correct_releases])
#print len(correct_releases)

artist_tuples = {}

total_records = []
for rel in correct_releases:
    records = musicbrainzngs.search_recordings(reid=rel["id"], limit=100)['recording-list']
    for rec in records:
        if "artist-credit" not in rec:
            continue
        #pp.pprint(rec)
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
                    if al in rappers:
                        total_records.append(rec)
                        #added = True
                        if al not in artist_tuples:
                            artist_tuples[al] = []
                        artist_tuples[al].append(rec["id"])
                        break

    time.sleep(1.3)

Rap = namedtuple("Rap", ["ar1", "ar2"])

final_tuples = {}
for k,v in artist_tuples.iteritems():
    #r = Rap(ar1=name, ar2=k)
    final_tuples[(str(name), str(k))] = list(set(v))

pp.pprint(final_tuples)

print len(total_records)
print [rec["title"] for rec in total_records]

"""
recordings = musicbrainzngs.get_artist_by_id(id, includes=["recordings", "releases"])
recording_list = recordings["artist"]["recording-list"]
rec_ids = [rec["id"] for rec in recording_list]

for k, v in recordings["artist"].iteritems():
    print k
    print v

releases = [rel for rel in recordings["artist"]["release-list"]]
print len(releases)
#print len(recording_list)
#print rec_ids
"""
