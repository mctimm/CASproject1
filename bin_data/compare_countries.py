import pyinform
import json
overall = []
with open("matching_data/OverallMatchingData_thrd.json") as f:
    data = json.load(f)
    for obj in data:
        xs = obj['c1_data'].split(",")
        xs = list(map(int, xs))
        ys = obj['c2_data'].split(",")
        ys = list(map(int, ys))
        entropy = pyinform.transfer_entropy(xs, ys, k=2)
        overall.append({"c1" : obj['c1_code'], "c2" : obj['c2_code'], "transfer_entropy" : entropy})
        # print("C1: {0}, C2: {1}".format(obj['c1_code'], obj['c2_code']))
        # print(str(entropy))
# print(overall)
f = open("transfer_entropy~!.json", "w")
printer = json.dump(overall, f)
# f.write(printer)
f.close()

# datum = {"AUT" : 6.35, "CYP" : 18.45, "" }

