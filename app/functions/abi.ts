export const balanceABI = [
    {
        constant: true,

        inputs: [{ name: "_owner", type: "address" }],

        name: "balanceOf",

        outputs: [{ name: "balance", type: "uint256" }],

        type: "function",
    },
];

export const transferABI = [
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                name: "success",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
]