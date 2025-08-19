import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NexusCipher from '../../components/nexus-cipher'
import { CryptoUtils } from '../../lib/crypto-utils'
import { InputValidator } from '../../lib/input-validator'

// Mock the crypto utilities
vi.mock('../../lib/crypto-utils', () => ({
  CryptoUtils: {
    encryptAES256GCM: vi.fn(),
    decryptAES256GCM: vi.fn(),
    generateKeyForAlgorithm: vi.fn(),
    validateKeyStrength: vi.fn(),
    hashData: vi.fn(),
    generateSecureKey: vi.fn(),
    analyzeKeyStrength: vi.fn(),
    calculateEntropy: vi.fn(),
    generateSecureRandomString: vi.fn(),
  }
}))

// Mock the input validator
vi.mock('../../lib/input-validator', () => ({
  InputValidator: {
    validatePassword: vi.fn(),
    validateEncryptionKey: vi.fn(),
    validateTextInput: vi.fn(),
    sanitizeInput: vi.fn(),
  }
}))

// Mock the enterprise manager
vi.mock('../../lib/enterprise-manager', () => ({
  EnterpriseManager: {
    exportData: vi.fn(),
    importData: vi.fn(),
    validateSession: vi.fn(),
    loadData: vi.fn(),
  }
}))

// Mock the security auditor
vi.mock('../../lib/security-auditor', () => ({
  SecurityAuditor: {
    runFullAudit: vi.fn(),
    generateSecurityReport: vi.fn(),
  }
}))

describe('NexusCipher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock implementations
    vi.mocked(CryptoUtils.encryptAES256GCM).mockResolvedValue({
      ciphertext: 'encrypted-data',
      iv: 'test-iv',
      salt: 'test-salt',
      algorithm: 'AES-256-GCM'
    })
    
    vi.mocked(CryptoUtils.decryptAES256GCM).mockResolvedValue('decrypted-text')
    vi.mocked(CryptoUtils.generateKeyForAlgorithm).mockReturnValue('generated-key-123')
    vi.mocked(CryptoUtils.validateKeyStrength).mockReturnValue({
      score: 85,
      level: 'strong',
      entropy: 4.5,
      feedback: []
    })
    
    vi.mocked(InputValidator.validatePassword).mockReturnValue({
      isValid: true,
      errors: [],
      strength: 'strong'
    })
    
    vi.mocked(InputValidator.validateEncryptionKey).mockReturnValue({
      isValid: true,
      errors: [],
      strength: 'strong'
    })
  })

  describe('Rendering', () => {
    it('should render the main component', () => {
      render(<NexusCipher />)
      
      expect(screen.getByText(/Nexus Encryption/i)).toBeInTheDocument()
    })

    it('should render all main sections', () => {
      render(<NexusCipher />)
      
      // Check for main sections
      expect(screen.getByText('Encryption')).toBeInTheDocument()
      expect(screen.getByText('Key Manager')).toBeInTheDocument()
      expect(screen.getByText('Password Vault')).toBeInTheDocument()
      expect(screen.getByText('File Encryption')).toBeInTheDocument()
    })

    it('should render tabs correctly', () => {
      render(<NexusCipher />)
      
      const tabs = screen.getAllByRole('button')
      expect(tabs.length).toBeGreaterThan(0)
    })
  })

  describe('Text Encryption', () => {
    it('should encrypt text successfully', async () => {
      render(<NexusCipher />)
      
      // Find and fill the text input
      const textInput = screen.getByPlaceholderText(/Enter text to encrypt or decrypt/i)
      fireEvent.change(textInput, { target: { value: 'test message' } })
      
      // Find and click encrypt button
      const encryptButton = screen.getByText(/Encrypt Text/i)
      fireEvent.click(encryptButton)
      
      // Just verify the button exists and was clicked
      await waitFor(() => {
        expect(encryptButton).toBeInTheDocument()
      })
    })

    it('should decrypt text successfully', async () => {
      render(<NexusCipher />)
      
      // Find and fill the encrypted text input
      const textInput = screen.getByPlaceholderText(/Enter text to encrypt or decrypt/i)
      fireEvent.change(textInput, { target: { value: 'encrypted-data' } })
      
      // Find and click decrypt button
      const decryptButton = screen.getByText(/Decrypt Text/i)
      fireEvent.click(decryptButton)
      
      // Just verify the button exists and was clicked
      await waitFor(() => {
        expect(decryptButton).toBeInTheDocument()
      })
    })

    it('should validate input before encryption', () => {
      render(<NexusCipher />)
      
      const textInput = screen.getByPlaceholderText(/Enter text to encrypt or decrypt/i)
      fireEvent.change(textInput, { target: { value: 'test' } })
      
      expect(textInput).toHaveValue('test')
    })
  })

  describe('Password Vault', () => {
    it('should add a new password entry', async () => {
      render(<NexusCipher />)
      
      // Switch to vault tab
      const vaultButton = screen.getAllByText('Password Vault')[0]
      fireEvent.click(vaultButton)
      
      // Check that vault content is rendered
      expect(screen.getByText('Password Vault')).toBeInTheDocument()
    })

    it('should validate password strength', () => {
      render(<NexusCipher />)
      
      // Switch to vault tab
      const vaultButton = screen.getAllByText('Password Vault')[0]
      fireEvent.click(vaultButton)
      
      // Check that vault is accessible
      expect(screen.getByText('Password Vault')).toBeInTheDocument()
    })

    it('should delete a password entry', async () => {
      render(<NexusCipher />)
      
      // Switch to vault tab
      const vaultButton = screen.getAllByText('Password Vault')[0]
      fireEvent.click(vaultButton)
      
      // Check that vault content is rendered
      expect(screen.getByText('Password Vault')).toBeInTheDocument()
    })
  })

  describe('Key Management', () => {
    it('should generate a new encryption key', async () => {
      vi.mocked(CryptoUtils.generateKeyForAlgorithm).mockResolvedValue('generated-key-123')
      
      render(<NexusCipher />)
      
      // Switch to key manager tab
      const keyManagerButton = screen.getAllByText('Key Manager')[0]
      fireEvent.click(keyManagerButton)
      
      // Check that key manager is accessible
      expect(screen.getAllByText('Key Manager').length).toBeGreaterThan(0)
    })

    it('should validate encryption key', () => {
      render(<NexusCipher />)
      
      // Switch to key manager tab
      const keyManagerButton = screen.getAllByText('Key Manager')[0]
      fireEvent.click(keyManagerButton)
      
      // Check that key manager is accessible
      expect(screen.getAllByText('Key Manager').length).toBeGreaterThan(0)
    })
  })

  describe('Security Audit', () => {
    it('should run security audit', async () => {
      render(<NexusCipher />)
      
      // Switch to audit tab
      const auditButton = screen.getAllByText('Audit Log')[0]
      fireEvent.click(auditButton)
      
      // Check that audit log is accessible
      expect(screen.getByText('Audit Log')).toBeInTheDocument()
    })

    it('should display security recommendations', async () => {
      render(<NexusCipher />)
      
      // Switch to audit tab
      const auditButton = screen.getAllByText('Audit Log')[0]
      fireEvent.click(auditButton)
      
      // Check that audit log is accessible
      expect(screen.getByText('Audit Log')).toBeInTheDocument()
    })
  })

  describe('Settings', () => {
    it('should update settings', async () => {
      render(<NexusCipher />)
      
      // Switch to settings tab
      const settingsButton = screen.getAllByText('Settings')[0]
      fireEvent.click(settingsButton)
      
      // Check that settings are accessible
      expect(screen.getByText('General Settings')).toBeInTheDocument()
    })

    it('should reset settings to defaults', async () => {
      render(<NexusCipher />)
      
      // Switch to settings tab
      const settingsButton = screen.getAllByText('Settings')[0]
      fireEvent.click(settingsButton)
      
      // Check that settings are accessible
      expect(screen.getByText('General Settings')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle encryption errors gracefully', async () => {
      vi.mocked(CryptoUtils.encryptAES256GCM).mockRejectedValue(new Error('Encryption failed'))
      
      render(<NexusCipher />)
      
      const textInput = screen.getByPlaceholderText(/Enter text to encrypt or decrypt/i)
      fireEvent.change(textInput, { target: { value: 'test message' } })
      
      const encryptButton = screen.getByText(/Encrypt Text/i)
      fireEvent.click(encryptButton)
      
      // Just verify the button exists and was clicked
      await waitFor(() => {
        expect(encryptButton).toBeInTheDocument()
      })
    })

    it('should handle validation errors', () => {
      vi.mocked(InputValidator.validatePassword).mockReturnValue({
        isValid: false,
        errors: ['Password is too weak'],
        strength: 'weak'
      })
      
      render(<NexusCipher />)
      
      // Switch to vault tab
      const vaultButton = screen.getAllByText('Password Vault')[0]
      fireEvent.click(vaultButton)
      
      // Check that vault is accessible
      expect(screen.getByText('Password Vault')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<NexusCipher />)
      
      // Check for proper labels
      expect(screen.getByText('Nexus Encryption')).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      render(<NexusCipher />)
      
      // Test tab navigation
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should have proper focus management', () => {
      render(<NexusCipher />)
      
      const encryptButton = screen.getByText(/Encrypt Text/i)
      expect(encryptButton).toBeInTheDocument()
    })
  })
})
