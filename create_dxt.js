#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create timestamp for unique naming
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const tempDir = path.join(process.cwd(), 'dxt_temp_' + timestamp);
const outputFile = path.join(process.cwd(), `gemini_cli_${timestamp}.dxt`);

console.log('🧹 Cleaning up old DXT files...');

// Remove old DXT files
const oldFiles = [
    'gemini_cli.dxt',
    'gemini_cli_fixed_v5.dxt', 
    'gemini_cli_fixed_v6.dxt',
    'gemini_cli_working.dxt',
    'gemini_cli_mcp.dxt',
    'gemini_simple.dxt'
];

oldFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log('🗑️  Removed:', file);
    }
});

// Also remove from home directory
const homeFile = path.join(process.env.HOME, 'gemini_simple.dxt');
if (fs.existsSync(homeFile)) {
    fs.unlinkSync(homeFile);
    console.log('🗑️  Removed:', homeFile);
}

console.log(`🏗️  Creating new DXT: gemini_cli_${timestamp}.dxt`);

// Clean up temp directory if exists
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir);

// 1. CORRECT manifest.json with proper server structure
const manifest = {
    dxt_version: "0.1",
    name: "gemini_cli",
    version: "0.1.0",
    description: "Run Gemini CLI",
    author: {
        name: "Simon Holm"
    },
    server: {
        type: "node",
        entry_point: "index.js",
        mcp_config: {
            command: "node",
            args: ["${__dirname}/index.js"]
        }
    }
};

fs.writeFileSync(path.join(tempDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('✅ Created minimal manifest');

// 2. SIMPLE MCP server
const server = `#!/usr/bin/env node
const { spawn } = require('child_process');

// Basic MCP over stdio
process.stdin.on('data', async (data) => {
    try {
        const request = JSON.parse(data.toString().trim());
        let response;

        if (request.method === 'initialize') {
            response = {
                jsonrpc: '2.0',
                id: request.id,
                result: {
                    protocolVersion: '2024-11-05',
                    capabilities: { tools: {} },
                    serverInfo: { name: 'gemini-cli', version: '0.1.0' }
                }
            };
        } else if (request.method === 'tools/list') {
            response = {
                jsonrpc: '2.0',
                id: request.id,
                result: {
                    tools: [{
                        name: 'gemini_run',
                        description: 'Run Gemini CLI',
                        inputSchema: {
                            type: 'object',
                            properties: { prompt: { type: 'string' } },
                            required: ['prompt']
                        }
                    }]
                }
            };
        } else if (request.method === 'tools/call' && request.params.name === 'gemini_run') {
            const prompt = request.params.arguments.prompt;
            const result = await runGemini(prompt);
            response = {
                jsonrpc: '2.0',
                id: request.id,
                result: { content: [{ type: 'text', text: result }] }
            };
        } else {
            response = {
                jsonrpc: '2.0',
                id: request.id,
                error: { code: -32601, message: 'Method not found' }
            };
        }

        process.stdout.write(JSON.stringify(response) + '\\n');
    } catch (e) {
        console.error('Error:', e.message);
    }
});

function runGemini(prompt) {
    return new Promise((resolve, reject) => {
        const gemini = spawn('gemini', ['-p', prompt]);
        let output = '';
        
        gemini.stdout.on('data', (data) => output += data);
        gemini.on('close', (code) => {
            if (code === 0) resolve(output.trim());
            else reject(new Error('Gemini failed'));
        });
        gemini.on('error', reject);
    });
}

console.error('Gemini MCP server started');
`;

fs.writeFileSync(path.join(tempDir, 'index.js'), server);
console.log('✅ Created simple server');

// 3. Create package
try {
    process.chdir(tempDir);
    execSync('zip -r "../' + path.basename(outputFile) + '" .', { stdio: 'pipe' });
    process.chdir('..');
    fs.rmSync(tempDir, { recursive: true });
    
    console.log('✅ Created:', path.basename(outputFile));
    console.log('📁 Full path:', outputFile);
    console.log('💡 This is your latest DXT - install this one!');
} catch (e) {
    console.error('Error:', e.message);
}
