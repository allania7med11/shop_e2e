FROM mcr.microsoft.com/playwright:v1.48.2-jammy

# Set working directory
WORKDIR /app

# Set ownership of /app directory to pwuser before switching users
RUN chown -R pwuser:pwuser /app

# Use the existing non-root 'pwuser'
USER pwuser

# Copy package.json and package-lock.json (if available) and install dependencies
COPY --chown=pwuser:pwuser package*.json ./
RUN npm install

# Copy the rest of the application files as 'pwuser'
COPY --chown=pwuser:pwuser . .

# Ensure run.sh is executable
RUN chmod +x ./run.sh

# Set the entry point for running tests
ENTRYPOINT ["sh", "./run.sh"]
