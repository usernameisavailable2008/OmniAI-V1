# Contributing to OmniAI

Thank you for your interest in contributing to OmniAI! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Security Considerations](#security-considerations)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat all contributors with respect and kindness
- **Be inclusive**: Welcome developers of all backgrounds and experience levels
- **Be constructive**: Provide helpful feedback and suggestions
- **Be professional**: Maintain a professional tone in all communications

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git
- A Shopify development store (for testing)
- OpenAI API key (for AI features)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/omniai.git
   cd omniai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   npm run setup
   # Follow the prompts to configure your environment
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## Contributing Guidelines

### Types of Contributions

We welcome the following types of contributions:

- **Bug fixes**: Fix existing issues or bugs
- **Feature enhancements**: Improve existing features
- **New features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize performance
- **Security**: Improve security measures

### Before You Start

1. **Check existing issues**: Look for existing issues or feature requests
2. **Create an issue**: If none exists, create a new issue describing your contribution
3. **Discuss the approach**: Engage with maintainers to discuss your approach
4. **Get approval**: Wait for approval before starting significant work

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test improvements
- `refactor/` - Code refactoring
- `security/` - Security improvements

Examples:
- `feature/ai-command-validation`
- `fix/memory-leak-in-chat`
- `docs/api-documentation-update`

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Run all checks**
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run test:e2e
   ```

3. **Update documentation** if needed

### PR Requirements

Your pull request must:

- [ ] Pass all automated checks (CI/CD pipeline)
- [ ] Include tests for new functionality
- [ ] Update documentation if applicable
- [ ] Follow our code style guidelines
- [ ] Include a clear description of changes
- [ ] Reference related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Security enhancement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
```

## Code Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object shapes
- Export types for public APIs

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Naming Conventions

- **Variables/Functions**: camelCase (`getUserData`)
- **Classes**: PascalCase (`UserService`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: kebab-case (`user-service.ts`)
- **Components**: PascalCase (`ChatBot.tsx`)

### File Organization

```
app/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # Business logic services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── middleware/         # Express middleware
└── routes/             # Remix routes
```

## Testing Requirements

### Test Coverage

- Maintain minimum 80% test coverage
- Write tests for all new features
- Update tests when modifying existing code
- Include both positive and negative test cases

### Test Types

1. **Unit Tests** (`__tests__/`)
   - Test individual functions and components
   - Mock external dependencies
   - Fast execution

2. **Integration Tests** (`__tests__/integration/`)
   - Test API endpoints
   - Test service interactions
   - Use test database

3. **E2E Tests** (`tests/e2e/`)
   - Test complete user workflows
   - Use Playwright for browser automation
   - Test critical user paths

### Writing Tests

```typescript
// Good test example
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    const user = await UserService.create(userData);
    
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
  });

  it('should throw error with invalid email', async () => {
    const userData = { email: 'invalid-email', name: 'Test User' };
    
    await expect(UserService.create(userData)).rejects.toThrow('Invalid email');
  });
});
```

## Documentation

### Code Documentation

- Use JSDoc comments for functions and classes
- Document complex logic and algorithms
- Include examples for public APIs
- Keep comments up-to-date with code changes

```typescript
/**
 * Processes AI commands for Shopify store automation
 * @param command - Natural language command from user
 * @param tier - User's subscription tier (1-3)
 * @param shop - Shopify store domain
 * @returns Promise resolving to command execution result
 * @throws {ValidationError} When command format is invalid
 * @example
 * ```typescript
 * const result = await processCommand(
 *   "Update all product titles",
 *   2,
 *   "mystore.myshopify.com"
 * );
 * ```
 */
async function processCommand(command: string, tier: number, shop: string) {
  // Implementation
}
```

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error codes and messages
- Use OpenAPI/Swagger when possible

## Security Considerations

### Security Guidelines

- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Follow OWASP security guidelines

### Security Review

All security-related changes require:

- Security team review
- Penetration testing (for major changes)
- Documentation updates
- Security audit trail

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- Email security@omniai.com with details
- Follow responsible disclosure practices

## Getting Help

### Resources

- **Documentation**: [docs.omniai.com](https://docs.omniai.com)
- **API Reference**: [api.omniai.com](https://api.omniai.com)
- **Discord Community**: [discord.gg/omniai](https://discord.gg/omniai)
- **Stack Overflow**: Tag questions with `omniai`

### Contact

- **General Questions**: support@omniai.com
- **Technical Issues**: Create a GitHub issue
- **Security Concerns**: security@omniai.com
- **Partnership Inquiries**: partnerships@omniai.com

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Annual contributor recognition program
- Community showcase

## License

By contributing to OmniAI, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to OmniAI! Your efforts help make AI-powered eCommerce automation accessible to everyone. 