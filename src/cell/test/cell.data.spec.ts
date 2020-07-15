

export const lockHash = "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2";
export const step = 20
export const page = 0;

export const mockCellsResult = [
    {
      "id" : 1803532,
      "index" : "0x0",
      "outputDataHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
      "typeHash" : null,
      "txHash" : "0xff3f9ded461b569789d8e8cf291c4b9e625472c92a99b229643294ef18b6316a",
      "timestamp" : 1593577808071,
      "lockHashType" : "type",
      "outputData" : "0x",
      "blockHash" : "0xa3c0577112c37c31efa8e2890344a25af65ba9665e479f2d5ee8b74c9002f10a",
      "typeHashType" : null,
      "capacity" : 10000000000,
      "address" : "",
      "lockArgs" : "0x9b84887ab2ea170998cff9895675dcd29cd26d4d",
      "lockHash" : "0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
      "blockNumber" : 166725,
      "typeArgs" : null,
      "lockCodeHash" : "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
      "status" : "live",
      "typeCodeHash" : null
    }
  ]

  export const mockTransactionResult = {
    "transaction":{
        "cellDeps":[
            {
                "outPoint":{
                    "txHash":"0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
                    "index":"0x0"
                },
                "depType":"depGroup"
            }
        ],
        "inputs":[
            {
                "previousOutput":{
                    "txHash":"0xf2df5519e1d1ad11d35da19bd2d825a351bbff841f6c8f8b2bfb993c3fa2e297",
                    "index":"0x1"
                },
                "since":"0x0"
            }
        ],
        "outputs":[
            {
                "lock":{
                    "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType":"type",
                    "args":"0x9b84887ab2ea170998cff9895675dcd29cd26d4d"
                },
                "type":null,
                "capacity":"0x2540be400"
            },
            {
                "lock":{
                    "codeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                    "hashType":"type",
                    "args":"0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34"
                },
                "type":null,
                "capacity":"0x4c5e5010e0"
            }
        ],
        "outputsData":[
            "0x",
            "0x"
        ],
        "headerDeps":[

        ],
        "hash":"0xff3f9ded461b569789d8e8cf291c4b9e625472c92a99b229643294ef18b6316a",
        "version":"0x0",
        "witnesses":[
            "0x5500000010000000550000005500000041000000fcce06b0da40ca9a7e2492f647c31d1c35c1db64214e9882a9878a58fb8ff80425bb15d823170f65012837c54392af233db25a4d5155fcd023c506a78187185201"
        ]
    },
    "txStatus":{
        "blockHash":"0xa3c0577112c37c31efa8e2890344a25af65ba9665e479f2d5ee8b74c9002f10a",
        "status":"committed"
    }
}

export const blockTx = [
    {
        "hash":"0xff3f9ded461b569789d8e8cf291c4b9e625472c92a99b229643294ef18b6316a",
        "blockNum":1468197,
        "timestamp":256,
        "inputs":[
            {
                "capacity":327999820000,
                "lockHash":"0x111823010653d32d36b18c9a257fe13158ca012e22b9b82f0640be187f10904b",
                "lockCodeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "lockArgs":"0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34",
                "lockHashType":"type"
            }
        ],
        "outputs":[
            {
                "capacity":10000000000,
                "lockHash":"0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
                "lockCodeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "lockArgs":"0x9b84887ab2ea170998cff9895675dcd29cd26d4d",
                "lockHashType":"type"
            },
            {
                "capacity":327999820000,
                "lockHash":"0x111823010653d32d36b18c9a257fe13158ca012e22b9b82f0640be187f10904b",
                "lockCodeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "lockArgs":"0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34",
                "lockHashType":"type"
            }
        ]
    }
]

export const mockGetTxHistoriesResult = [
    {
        "hash":"0xff3f9ded461b569789d8e8cf291c4b9e625472c92a99b229643294ef18b6316a",
        "blockNum":166725,
        "timestamp":256,
        "inputs":[
            {
                "capacity":327999820000,
                "lockHash":"0x111823010653d32d36b18c9a257fe13158ca012e22b9b82f0640be187f10904b",
                "lockCodeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "lockArgs":"0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34",
                "lockHashType":"type"
            }
        ],
        "outputs":[
            {
                "capacity":10000000000,
                "lockHash":"0x5d67b4eeb98698535f76f1b34a77d852112a35072eb6b834cb4cc8868ac02fb2",
                "lockCodeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "lockArgs":"0x9b84887ab2ea170998cff9895675dcd29cd26d4d",
                "lockHashType":"type"
            },
            {
                "capacity":327999820000,
                "lockHash":"0x111823010653d32d36b18c9a257fe13158ca012e22b9b82f0640be187f10904b",
                "lockCodeHash":"0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
                "lockArgs":"0x8eb4d75815e2207bd29a0b3651523e5a48e8fd34",
                "lockHashType":"type"
            }
        ],
        "fee":0,
        "amount":10000000000,
        "income":true
    }
];