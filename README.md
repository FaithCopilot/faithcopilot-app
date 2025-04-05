# FaithCopilot 🐟 - "Helping you put the AI in FAITH"

FaithCopilot 🐟 (FC) Web App is an open source fork of [FaithCopilot Cloud 🐟☁️ ](https://faithcopilot.com) which enables local (private or even offline) usage of FC for personal, private, or enterprise use cases. It largely implements functionality available in the FC Cloud offering, but the Cloud offering will continue to move in a more public, consumer, and social direction.

While not technically required, normally FC Web App will deploy/run alongside the corresponding [FaithCopilot 🐟 API](https://github.com/FaithCopilot/faithcopilot-api)


## Highlighted Features

* Supports local and offline usage
* Interface with private models
* Workflow capabilities (ie, a "poorman's" Zapier, Make):
  - Context: Web Search, Proprietary Data, APIs, MCP, etc...
  - Safety: Guardrails, Evals, etc...
* Integrated Search support
* Access control capabilities: API Keys, Policies and more 
* Gather data to fine-tune models


## Getting Started

This section should provide a quick overview of how to get your project running.


### Prerequisites

Before you begin, ensure you have the following installed:

* Node (https://nodejs.org/)
* pnpm (https://pnpm.io/)
* nvm (https://github.com/nvm-sh/nvm)


### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/FaithCopilot/faithcopilot-api.git
    cd faithcopilot-api
    ```
2.  Initialize the Node environment: 
    ```bash
    nvm use
    ```
3.  Install the npm packages:
    ```bash
    pnpm install
    ```
4.  Start the API service:
    ```bash
    pnpm run dev
    ```


### Highlighted Frameworks and Libraries

* [React](https://react.dev/)
* [Astro](https://astro.build/) used for:
  - routing and [MPA (Multi-Page App)](https://docs.astro.build/en/concepts/why-astro/#server-first) capabilities,
  - innovative [Islands](https://docs.astro.build/en/concepts/islands/) architecture,
  - [fast-by-default](https://docs.astro.build/en/concepts/why-astro/#fast-by-default) approach,
  - the integrated [Vite](https://vite.dev/) build system for rendering React components


### External Dependencies

The only external service that this project relies on is a FaithCopilot-compatible API (whether the open source local offering or the FC Cloud 🐟☁️  API):

* [FaithCopilot 🐟 API](https://github.com/FaithCopilot/faithcopilot-api)
* [FaithCopilot Cloud 🐟☁️  API](https://faithcopilot.com)
