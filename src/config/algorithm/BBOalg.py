import sys
import json

if __name__ == "__main__":
   argv_json = json.loads(sys.argv[1]) # 获取 node 传递过来的 JSON 参数。
   
   node = argv_json["nodes"] # do something...

   print(json.dumps(node)) # 返回算法的处理结果。