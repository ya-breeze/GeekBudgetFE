FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Install bash completion
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    bash-completion

# Install angular
RUN npm install -g @angular/cli
