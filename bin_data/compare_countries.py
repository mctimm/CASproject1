import pyinform
import json
from operator import itemgetter
overall = []
temps = {}
with open("average_temperature_for_our_countries.json") as fp:
    temp_data = json.load(fp)
    for x in temp_data:
        temps[x['country']] = x['temp']
with open("matching_data/OverallMatchingData.json") as f:
    data = json.load(f)
    for obj in data:
        xs = obj['c1_data'].split(",")
        xs = list(map(int, xs))
        ys = obj['c2_data'].split(",")
        ys = list(map(int, ys))
        entropy = pyinform.transfer_entropy(xs, ys, k=3)
        overall.append({"c1" : obj['c1_code'], "c2" : obj['c2_code'], "Transfer Entropy" : entropy, 'c1_temp' : temps[obj['c1_code']], 'c2_temp' : temps[obj['c2_code']], 'Combined Temperature' :  temps[obj['c1_code']] +  temps[obj['c2_code']] })
        # print("C1: {0}, C2: {1}".format(obj['c1_code'], obj['c2_code']))
        # print(str(entropy))
    with open("average_temperature_for_our_countries.json") as fp:
        temp_data = json.load(fp)
        for x in temp_data:
            overall.append({"c1" : x['country'], "c2" : x['country'], "Transfer Entropy" : None, 'c1_temp' : x['temp'], 'c2_temp' : x['temp']})
# print(overall)
overall = sorted(overall, key=itemgetter('c1_temp', 'c2_temp'))
overall.reverse()
f = open("transfer_entropy & temp - sorted! with combined temperature.json", "w")
printer = json.dump(overall, f)
# f.write(printer)
f.close()

# datum = {"AUT" : 6.35, "CYP" : 18.45, "" }

