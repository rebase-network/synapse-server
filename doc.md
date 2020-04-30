
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