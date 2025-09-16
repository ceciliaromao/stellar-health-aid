# Stellar Health Aid

Repository participating in **HackMeridian 2025**

-----

## Overview

**Stellar Health Aid** is a decentralized, self-custodial health wallet that gives control back to the user. In the private system, you pay every month, even if you don't use anything. With Stellar Health Aid, your money always remains yours. If you don't use it for 4 months, in the 5th month you will have an accumulated balance plus interest to cover medical expenses.

-----

## Technologies Used

### Main Languages

  - **TypeScript (89.8%)**
      - Used for the main frontend and backend development, ensuring static typing, scalability, and better code maintenance.
  - **Rust (7.9%)**
      - Employed in the construction of smart contracts, due to its high performance, memory safety, and robustness.
  - **CSS (2%)**
      - Responsible for responsive design and styling of web pages, ensuring a modern and accessible user experience.
  - **JavaScript (0.3%)**
      - Used for auxiliary scripts and quick integration between modules.

### Frameworks and Tools

  - **ReactJS**
      - Development of the SPA (Single Page Application) frontend, promoting interactivity and performance.
  - **Next.js**
      - Framework for SSR (Server Side Rendering) and optimized routes.
  - **Stellar SDK**
      - Library for integration with the Stellar blockchain, allowing for fast and low-cost transactions.
  - **Polkadot.js / Substrate**
      - Interoperability and security in smart contracts, especially in the parts written in Rust.
  - **Node.js**
      - Execution environment for APIs, middlewares, and backend scripts.
  - **Docker**
      - Containerization of services to facilitate deployment and scalability.
  - **GitHub Actions**
      - CI/CD for automating tests, builds, and deployments.

-----

## Project Structure

```
/
├── src/              # Main source code (TypeScript)
│   ├── components/   # Reusable React components
│   ├── contracts/    # Smart contracts (Rust)
│   ├── pages/        # Next.js pages
│   └── styles/       # CSS stylesheets
├── public/           # Static files and images
├── tests/            # Unit and integration tests
├── .github/          # CI/CD workflows
├── package.json      # Project dependencies
├── Dockerfile        # Containerization
├── README.md         # Main documentation
└── ...               # Other configuration files
```

-----

## Features

  - **User registration and authentication**
  - **Blockchain-tracked donations**
  - **Digital wallet management**
  - **Transaction transparency and auditing**
  - **Interactive dashboard for tracking donations**
  - **Modular system for integration with clinics and NGOs**

-----

## How to Run

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

      - Rename `.env.example` to `.env` and fill in the required data (Stellar keys, endpoints, etc.).

4.  **Run the application**

    ```bash
    npm run dev
    ```

5.  **Smart contracts**

      - Access the `src/contracts` folder and follow the instructions in the specific README to deploy the Rust contracts.

-----

## Contributing

Contributions are welcome\!
See the `CONTRIBUTING.md` file and follow our code of conduct.

-----

## License

This project is licensed under the MIT License.

-----

## Contact

Questions or suggestions? Open an issue or contact the team via [GitHub issues](https://github.com/ceciliaromao/stellar-health-aid/issues).

-----

> Project developed during **HackMeridian 2025** with a focus on social impact and technological innovation in health.
