
## get_cells

```
echo '{
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_cells",
    "params": [
        {
            "script": {
                "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "hash_type": "type",
                "args": "0x5fed40f987d2578b9e68101f676c4fe72e019f39"
            },
            "script_type": "lock"
        },
        "asc",
        "0x64"
    ]
}' \
| tr -d '\n' \
| curl -X POST -H 'content-type: application/json' -d @- \
http://101.200.147.143:8117/indexer


{
  "jsonrpc": "2.0",
  "result": {
    "last_cursor": "0x409bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce801140000005fed40f987d2578b9e68101f676c4fe72e019f39000000000002a6f90000000100000000",
    "objects": [{
        "block_number": "0x12487",
        "out_point": {
          "index": "0x0",
          "tx_hash": "0xa429dcd8add0d345c8808189f2c26b0613724d8c4a526dee8300dc425c306416"
        },
        "output": {
          "capacity": "0x746a528800",
          "lock": {
            "args": "0x5fed40f987d2578b9e68101f676c4fe72e019f39",
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "hash_type": "type"
          },
          "type": null
        },
        "output_data": "0x",
        "tx_index": "0x1"
      },
      {
        "block_number": "0x23a2d",
        "out_point": {
          "index": "0x0",
          "tx_hash": "0xa7852c6c37d773eaf9db00c48d623acf6bba2e06b1490f57fc2cbb45f23cd77c"
        },
        "output": {
          "capacity": "0x746a528800",
          "lock": {
            "args": "0x5fed40f987d2578b9e68101f676c4fe72e019f39",
            "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
            "hash_type": "type"
          },
          "type": null
        },
        "output_data": "0x",
        "tx_index": "0x12"
      }
    ]
  },
  "id": 0
}
```
## getUnspentCells
```
### request params
lockHash
limit 
hasData
capacity
typeHash
- 其中lockHash 必须传值

- limit和capacity 必须有一个值存在
  limit表示查询多少记录
   capacity表示查询的cells的余额值
- typeHash可选项
   查询UDT时用
- hasData 可选项
   "true","false",不传
  - "true"表示查询的是包含数据的cells | outputdata != '0x'
  - "false"表示查询的是不包含数据的cells | outputdata == '0x'
  - 不传值表示查询所有的cells

### request url

http://localhost:2333/cell/getUnspentCells?lockHash=0x98ddfc5f3e0836ee1bda3ebef2f0156abb74b632dc9c6a412dce53a13e4c6fdb&status=live&limit=10&hasData=true


### response

{
    "errCode": 0,
    "errMsg": "",
    "data": [
        {
            "blockHash": "0x4f295363dd3b2de20038b7e7674a16bdbb0c4f29a765b2699f4c618a59e19f65",
            "lock": {
                "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "hashType": "type",
                "args": "0x72bbbc9d918e4cdc2b4daeb8743f092b5f8abfed"
            },
            "lockHash": "0x98ddfc5f3e0836ee1bda3ebef2f0156abb74b632dc9c6a412dce53a13e4c6fdb",
            "outPoint": {
                "txHash": "0x6f010b3ed28b8c3d38a2b3bd186d5027ba9df11f143860a482b3df3e3df42b5b",
                "index": "0x1"
            },
            "outputData": "0x",
            "outputDataLen": "0x0",
            "capacity": "0x72f8c60618",
            "type": {
                "codeHash": null,
                "hashType": null,
                "args": null
            },
            "typeHash": null,
            "dataHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "status": "live"
        }
    ]
}


