# 💉 Stellar Health Aid

Repository participating in **HackMeridian 2025**
*Social innovation and technology to transform healthcare via Web3\!*

> [\!CAUTION]
> This project has not been tested to its limits. We are in the process of improving it. Everything is being done on the testnet.
> Please take this into consideration.

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
    SSR (Server Side Rendering) and optimized routes.
  - **Stellar SDK**
    Integration with the Stellar blockchain for fast, low-cost transactions.
  - **Stellar Scaffold**
  - **Node.js**
    Backend, APIs, and support scripts.

### UI Design
  - **Figma**
    You can check it [here](https://www.figma.com/design/WbyQH5ocVgD5eb8FzYKr5J/Stellar-Health-Aid?node-id=0-1&p=f&t=BBMlX52xrA3cKqKD-0).

-----

## 🗂️ Project Structure

```
/
├── src/              # Main source code (TypeScript)
│   ├── components/   # Reusable React components
│   ├── contracts/    # Smart contracts (Rust)
│   ├── pages/        # Next.js pages
│   └── styles/       # CSS
├── public/           # Static files/images
├── tests/            # Unit/integration tests
├── .github/          # CI/CD Workflows
├── package.json      # Dependencies
├── README.md         # Main documentation
└── ...               # Other configuration files
```

-----

## 💡 Features

  - User registration and authentication
  - Blockchain-tracked donations
  - Digital wallet management (deposit, withdrawal, yield)
  - Transaction transparency and auditing
  - Interactive dashboard for monitoring
  - Modular system for integration with clinics and NGOs
  - DeFi integrations (Blend, Defindex, Soroswap, Reflector)

-----

## 🤝 DeFi Integrations

  - **Usage Flow:**
    The integration is used within the wallet context in [`src/context/WalletProvider.tsx`](https://www.google.com/search?q=src/context/WalletProvider.tsx), allowing deposits and withdrawals via Blend directly from the user's dashboard.

### Defindex

  - **Rust File:** [`contracts/health-aid-wallet/src/contract.rs`](https://www.google.com/search?q=contracts/health-aid-wallet/src/contract.rs)
    The `get_defindex_contract` function and balancing methods implement the bridge to Defindex at the smart contract layer.

  - **Backend:**
    The `defindex` parameter is used in the contract deployment endpoints, as seen in [`src/app/api/contracts/wallet/deploy/route.ts`](https://www.google.com/search?q=src/app/api/contracts/wallet/deploy/route.ts).

### Reflector

  - **API:** [`src/app/api/reflector/prices/route.ts`](https://www.google.com/search?q=src/app/api/reflector/prices/route.ts)
    A Next.js endpoint that uses the Stellar Soroban SDK to get updated asset prices, integrating the Reflector protocol for swap operations and price queries.
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

      - Rename `.env.example` to `.env` and fill it with the necessary information (Stellar keys, endpoints, etc.).

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
