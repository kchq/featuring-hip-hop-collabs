import musicbrainzngs
import json

musicbrainzngs.set_useragent("Example music app", "0.1", "http://example.com/music")

recordDictionary = {}
def addRecordData(recId, relId):
	relResult = musicbrainzngs.get_release_by_id(relId)
	recResult = musicbrainzngs.get_recording_by_id(recId)
	recordDictionary[recId] = {'date': relResult["release"]["date"], 'title': recResult["recording"]["title"]}

def printOutRecordDictionary(filename):
	json.dump(recordDictionary, open(filename, 'w'))
	
