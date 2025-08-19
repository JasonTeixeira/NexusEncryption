export interface Translation {
  [key: string]: string | Translation
}

export class I18nManager {
  private static currentLanguage = "en"
  private static translations: Record<string, Translation> = {
    en: {
      common: {
        encrypt: "Encrypt",
        decrypt: "Decrypt",
        password: "Password",
        settings: "Settings",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        export: "Export",
        import: "Import",
      },
      tabs: {
        encryption: "Encryption",
        keyManager: "Key Manager",
        passwordVault: "Password Vault",
        fileEncryption: "File Encryption",
        keyGenerator: "Key Generator",
        hashFunctions: "Hash Functions",
        auditLog: "Audit Log",
        settings: "Settings",
      },
      security: {
        strongPassword: "Strong Password",
        weakPassword: "Weak Password",
        mfaEnabled: "Multi-Factor Authentication Enabled",
        threatDetected: "Security Threat Detected",
        complianceCheck: "Compliance Check Passed",
      },
    },
    es: {
      common: {
        encrypt: "Cifrar",
        decrypt: "Descifrar",
        password: "Contraseña",
        settings: "Configuración",
        save: "Guardar",
        cancel: "Cancelar",
        delete: "Eliminar",
        export: "Exportar",
        import: "Importar",
      },
      tabs: {
        encryption: "Cifrado",
        keyManager: "Gestor de Claves",
        passwordVault: "Bóveda de Contraseñas",
        fileEncryption: "Cifrado de Archivos",
        keyGenerator: "Generador de Claves",
        hashFunctions: "Funciones Hash",
        auditLog: "Registro de Auditoría",
        settings: "Configuración",
      },
      security: {
        strongPassword: "Contraseña Fuerte",
        weakPassword: "Contraseña Débil",
        mfaEnabled: "Autenticación Multifactor Habilitada",
        threatDetected: "Amenaza de Seguridad Detectada",
        complianceCheck: "Verificación de Cumplimiento Aprobada",
      },
    },
    fr: {
      common: {
        encrypt: "Chiffrer",
        decrypt: "Déchiffrer",
        password: "Mot de passe",
        settings: "Paramètres",
        save: "Enregistrer",
        cancel: "Annuler",
        delete: "Supprimer",
        export: "Exporter",
        import: "Importer",
      },
      tabs: {
        encryption: "Chiffrement",
        keyManager: "Gestionnaire de Clés",
        passwordVault: "Coffre-fort de Mots de Passe",
        fileEncryption: "Chiffrement de Fichiers",
        keyGenerator: "Générateur de Clés",
        hashFunctions: "Fonctions de Hachage",
        auditLog: "Journal d'Audit",
        settings: "Paramètres",
      },
      security: {
        strongPassword: "Mot de Passe Fort",
        weakPassword: "Mot de Passe Faible",
        mfaEnabled: "Authentification Multi-Facteurs Activée",
        threatDetected: "Menace de Sécurité Détectée",
        complianceCheck: "Vérification de Conformité Réussie",
      },
    },
  }

  static setLanguage(language: string): void {
    if (this.translations[language]) {
      this.currentLanguage = language
      localStorage.setItem("nexus-cipher-language", language)
    }
  }

  static getCurrentLanguage(): string {
    return this.currentLanguage
  }

  static t(key: string): string {
    const keys = key.split(".")
    let value: any = this.translations[this.currentLanguage]

    for (const k of keys) {
      value = value?.[k]
    }

    return typeof value === "string" ? value : key
  }

  static getSupportedLanguages(): Array<{ code: string; name: string; flag: string }> {
    return [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Español", flag: "🇪🇸" },
      { code: "fr", name: "Français", flag: "🇫🇷" },
      { code: "de", name: "Deutsch", flag: "🇩🇪" },
      { code: "zh", name: "中文", flag: "🇨🇳" },
      { code: "ja", name: "日本語", flag: "🇯🇵" },
    ]
  }

  static detectBrowserLanguage(): string {
    const browserLang = navigator.language.split("-")[0]
    return this.translations[browserLang] ? browserLang : "en"
  }
}
