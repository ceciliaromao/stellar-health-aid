# 💉 Stellar Health Aid

Repository participating in **HackMeridian 2025**
*Social innovation and technology to transform healthcare via Web3\!*

> [\!CAUTION]
> This project has not been tested to its limits. We are in the process of improving it. Everything is being done on the testnet.
> Please take this into consideration.


## 🔗 Example Deposit Transaction

You can view a **sample deposit transaction** executed on the Stellar testnet via Stellar Expert:

👉 [View on Stellar Expert](https://stellar.expert/explorer/testnet/tx/SEU_HASH_AQUI)
-----

## ✨ Overview

**Stellar Health Aid** is a decentralized, self-custodial health wallet that gives control back to the user. In the private system, you pay every month, even if you use nothing. With Stellar Health Aid, your money always remains yours. If you don't use it for 4 months, in the 5th month you will have an accumulated balance + interest to cover medical expenses.

-----

## 🛠️ Technologies and Languages Used

### Main Languages

  - **TypeScript (89.8%)**
    Used in the frontend and backend, ensuring static typing, scalability, and enhanced maintenance.
  - **Rust (7.9%)**
    Employed in building the smart contracts, offering high performance, memory safety, and robustness.
  - **CSS (2%)**
    Responsible for the responsive design and styling, ensuring a modern and accessible experience.
  - **JavaScript (0.3%)**
    Used for auxiliary scripts and quick integrations between modules.

### Frameworks and Tools

  - **ReactJS**
    Interactive and high-performance frontend SPA.
  - **Next.js**
    SSR (Server Side Rendering), optimized routing, and frontend application logic.
  - **Next.js Route Handlers**
    Backend API endpoints and server-side logic, fully integrated with Next.js.
  - **Stellar SDK**
    Integration with the Stellar blockchain for fast, low-cost transactions.
  - **Stellar Scaffold**

### UI Design
  - **Figma**
    You can check it [here](https://www.figma.com/design/WbyQH5ocVgD5eb8FzYKr5J/Stellar-Health-Aid?node-id=0-1&p=f&t=BBMlX52xrA3cKqKD-0).

-----

## 🗂️ Project Structure

```

├── contracts/                # Smart contracts (Rust/Soroban)
│   ├── fungible-token-interface/
│   ├── health-aid-wallet/
│   ├── hello_world/
│   ├── nft-enumerable/
│   ├── provider-registry/
│   └── ...
│       └── src/              # Contract source code
│       └── test.rs           # Contract tests
│       └── Cargo.toml        # Contract configuration
│       └── test_snapshots/   # Test results
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # Next.js Route Handlers (API endpoints)
│   │   │   ├── auth/
│   │   │   ├── reflector/
│   │   │   ├── contracts/
│   │   │   └── wallet/
│   │   ├── community/        # Community and donation pages
│   │   ├── dashboard/        # Dashboard pages (wallet, deposit, payment, profile)
│   │   ├── history/          # Transaction history page
│   │   ├── kyc/              # Identity verification page
│   │   ├── login/            # Login page
│   │   ├── _components/      # Landing page components
│   │   └── ...
│   ├── components/
│   │   ├── molecules/        # Reusable components (cards, boxes, etc)
│   │   ├── organisms/        # Composite components (carousels, overviews)
│   │   ├── ui/               # UI components (button, input, etc)
│   │   └── payment-success.tsx, back-page.tsx # Global utility components
│   ├── context/              # Context providers (Auth, Wallet, etc)
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility functions and API integrations
│   ├── types/                # Global TypeScript types
│   ├── util/                 # Project-specific utility functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Prisma migrations
├── public/
│   ├── images/               # Public assets (logos, mockups, etc)
├── package.json              # Node.js project configuration
├── Cargo.toml                # Rust workspace configuration
├── .env                      # Environment variables
└── README.md                 # Project documentation
```

## 💡 Features

  - User registration and authentication
  - Blockchain-tracked donations
  - Digital wallet management (deposit, withdrawal, yield)
  - Transaction transparency and auditing
  - Interactive dashboard for monitoring
  - Modular system for integration with clinics and NGOs
  - DeFi integrations (Blend, Defindex, Reflector)

-----

## 🤝 DeFi Integrations

- **Usage Flow:**  
  The integration is used within the wallet context, allowing deposits and withdrawals via Blend directly from the user's dashboard.

### Defindex
- **Rust File:** 
  The `get_defindex_contract` function and balancing methods implement the bridge to Defindex at the smart contract layer.

- **Backend:**  
  The `defindex` parameter is used in the contract deployment endpoints.

### Reflector
- **API:**
  A Next.js endpoint that uses the Stellar Soroban SDK to get updated asset prices, integrating the Reflector protocol for swap operations and price queries.

### Crossmint
- **Frontend & Backend:**  
  Crossmint is integrated to provide **user onboarding and wallet creation with social login (Google)**.  
  This allows new users to create and access their **Health Aid Wallet** seamlessly without needing to manage private keys manually.  

-----

## 🚦 How to Run

1.  **Clone the repository**

    ```bash
    git clone https://github.com/ceciliaromao/stellar-health-aid.git
    cd stellar-health-aid
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**

  - Create a `.env` file and add environment variables using the following pattern:

```properties
# Database Configuration
PRISMA_DATABASE_URL="prisma+postgres://<user>:<password>@<host>:<port>/<database>?sslmode=require"         # Prisma connection string for the main database
DATABASE_URL="postgres://<user>:<password>@<host>:<port>/<database>?sslmode=require"                       # Standard database connection string (Postgres)
SHADOW_DATABASE_URL="postgres://<user>:<password>@<host>:<port>/<database>?sslmode=require"                # Shadow database for migrations and tests

# Crossmint Configuration
SERVER_CROSSMINT_API_KEY="sk_staging_..."    # API key for server-side Crossmint requests
CROSSMINT_API_BASE_URL="https://staging.crossmint.com/api/2025-06-09"      # Base URL for Crossmint API
NEXT_PUBLIC_CROSSMINT_API_KEY="ck_staging_..." # Public API key for client-side Crossmint requests
NEXT_PUBLIC_CHAIN="stellar"       # Blockchain network used (Stellar)

# Passkey Configuration (Client)
NEXT_PUBLIC_STELLAR_RPC_URL="https://soroban-testnet.stellar.org" # RPC URL for Soroban/Stellar testnet
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015" # Network passphrase for Stellar

# Passkey Configuration (Server)
NEXT_PUBLIC_LAUNCHTUBE_URL="https://testnet.launchtube.xyz"  # LaunchTube API URL for passkey operations
PRIVATE_LAUNCHTUBE_JWT="..."      # JWT for server authentication with LaunchTube
NEXT_PUBLIC_MERCURY_URL="https://api.mercurydata.app"     # Mercury API URL for asset data
PRIVATE_MERCURY_JWT="..."         # JWT for server authentication with Mercury
PRIVATE_MERCURY_KEY="..."         # Mercury API key (generated via API)

# Smart Wallet Configuration
NEXT_PUBLIC_WALLET_WASM_HASH="..." # Wasm hash for smart wallet contract deployment
NEXT_PUBLIC_NATIVE_CONTRACT_ADDRESS="..." # Native XLM contract address on Testnet

# Soroban Secret Key
SOROBAN_SECRET_KEY="..."          # Secret key for Soroban contract operations

# Admin Keys (Server)
ADMIN_PUBLIC_KEY="GC..."            # Public key for admin operations (provider creation)
ADMIN_PRIVATE_KEY="SB..."           # Private key for admin operations
REGISTRY_ADDRESS="CB..."            # Registry contract address

# DeFindex Configuration
USDC_TOKEN_ADDRESS="CB..."          # USDC token address on Testnet
DEFINDEX_CONTRACT="CB..."           # DeFindex contract address
```

4.  **Run the application**

    ```bash
    npm run dev
    ```

5.  **Deploy the smart contracts**

      - Go to the `src/contracts` folder and follow the instructions in the specific README to compile/deploy the Rust contracts.

-----

## 📝 Contributing

Contributions are welcome\!
See the `CONTRIBUTING.md` file and follow our code of conduct.

-----

## 📄 License

This project is licensed under the MIT License.

-----

> Project developed during **HackMeridian 2025** with a focus on social impact and technological innovation in health.
