# Claude Desktop Extension (DXT) Development Survival Guide

*A practical guide to building working Claude Desktop Extensions without the headaches*

[![DXT Version](https://img.shields.io/badge/DXT-0.1-blue)](https://github.com/anthropics/dxt)
[![MCP Protocol](https://img.shields.io/badge/MCP-2024--11--05-green)](https://modelcontextprotocol.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 What This Guide Covers

This repository contains a **working Gemini CLI integration** for Claude Desktop and serves as a comprehensive guide for DXT development. Learn from real-world challenges and solutions that aren't covered in the official documentation.

## ⚡ Quick Start

1. **Clone this repo** for a working example
2. **Install the DXT** in Claude Desktop
3. **Use `@gemini_run <prompt>`** to analyze codebases
4. **Study the code** to understand DXT architecture
eof

**Critical URLs:**
- [DXT Specification](https://github.com/anthropics/dxt/blob/main/MANIFEST.md)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Claude Desktop Extensions](https://support.anthropic.com/en/articles/10949351)

### System Requirements
- **Claude Desktop**: Latest version
- **Node.js**: v16+ (for Node.js-based extensions)
- **Python**: 3.8+ (for Python-based extensions)
- **Target Tool**: Whatever CLI tool you're integrating

## 🏗️ Architecture Overview

### Current DXT Structure (2025)
```
extension.dxt (ZIP archive)
├── manifest.json          # Extension metadata & configuration
├── server/                 # MCP server implementation
│   └── index.js           # Entry point (Node.js example)
├── package.json           # Dependencies (optional)
└── README.md              # Documentation
```

### MCP Protocol Flow
```
Claude Desktop → MCP Protocol → Your Extension → External Tool → Response
```

**Key Point**: DXT extensions use the Model Context Protocol (MCP) over stdio, **not HTTP servers**.

## ⚙️ Manifest Configuration

### Minimal Working Manifest
```json
{
  "dxt_version": "0.1",
  "name": "your-extension",
  "version": "0.1.0",
  "description": "Brief description of your extension",
  "author": {
    "name": "Your Name"
  },
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"]
    }
  }
}
```

### Supported Server Types
- `"node"` - Node.js applications
- `"python"` - Python applications
- `"binary"` - Compiled executables

## ⚙️ Manifest Configuration

### Minimal Working Manifest
```json
{
  "dxt_version": "0.1",
  "name": "your-extension",
  "version": "0.1.0",
  "description": "Brief description of your extension",
  "author": {
    "name": "Your Name"
  },
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"]
    }
  }
}
```

### Supported Server Types
- `"node"` - Node.js applications
- `"python"` - Python applications
- `"binary"` - Compiled executables

## 💀 Common Pitfalls & Solutions

### Manifest Validation Errors

**Error**: `"Invalid manifest: dxt_version: Required"`
**Solution**: Use `"dxt_version": "0.1"` (not "0.1.0" or "1.0")

**Error**: `"Invalid enum value. Expected 'python' | 'node' | 'binary', received 'http'"`
**Solution**: Use MCP over stdio, not HTTP servers. Set `"type": "node"`

**Error**: `"server: Required, Required"`
**Solution**: Ensure server object has `type`, `entry_point`, and `mcp_config`

### MCP Protocol Issues

**Problem**: Tool not appearing in Claude Desktop
**Solutions**:
- Verify `tools/list` method returns proper schema
- Check tool name matches exactly in `tools/call`
- Restart Claude Desktop after installation

**Problem**: Tool execution fails silently
**Solutions**:
- Add error logging to stderr: `console.error('Debug info')`
- Test external dependencies separately
- Verify file permissions and PATH

## 🔍 Debugging Toolkit

### Error Message Decoder
| Error | Cause | Fix |
|-------|-------|-----|
| "Extension Preview Failed" | Manifest validation | Check JSON syntax and required fields |
| "server: Required" | Missing server config | Add complete server object |
| "Method not found" | MCP method not implemented | Implement missing MCP methods |
| "Tool execution failed" | External tool issues | Test tool separately, check PATH |

### Debug Commands
```bash
# Validate DXT package
unzip -l your-extension.dxt

# Test manifest
cat manifest.json | jq '.'

# Check external dependencies
which your-cli-tool
your-cli-tool --version

# Test MCP server manually
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node server/index.js
```

### Development Workflow
1. **Start with minimal manifest**
2. **Implement basic MCP server**
3. **Test installation in Claude Desktop**
4. **Add tool functionality incrementally**
5. **Test each addition**

## 📚 Resources & References

### Official Documentation
- [DXT GitHub Repository](https://github.com/anthropics/dxt)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop Extensions Guide](https://support.anthropic.com/en/articles/10949351)

### Community Resources
- [Awesome Claude DXT](https://github.com/milisp/awesome-claude-dxt)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)
- [DXT Examples](https://github.com/anthropics/dxt/tree/main/examples)

### Development Tools
- [Claude Code CLI](https://claude.ai/chat) - Better for development/debugging
- [DXT CLI Tool](https://www.npmjs.com/package/@anthropic-ai/dxt) - Official build tool

## 🎯 Best Practices

### 1. **Start Simple**
Begin with a minimal working extension before adding complexity.

### 2. **Test Incrementally**
Test each component (manifest, MCP server, tool integration) separately.

### 3. **Handle Errors Gracefully**
```javascript
// Always include error handling
try {
    const result = await riskyOperation();
    return result;
} catch (error) {
    console.error('Operation failed:', error.message);
    throw new Error(`Tool execution failed: ${error.message}`);
}
```


