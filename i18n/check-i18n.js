#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * i18n 检查脚本
 * 检查翻译文件中缺失的键值对
 */

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales')
const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US']

/**
 * 递归获取对象的所有键路径
 * @param {Object} obj 对象
 * @param {string} prefix 前缀
 * @returns {Array} 键路径数组
 */
function getAllKeys(obj, prefix = '') {
  let keys = []
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = keys.concat(getAllKeys(obj[key], fullKey))
      } else {
        keys.push(fullKey)
      }
    }
  }
  
  return keys
}

/**
 * 检查翻译文件
 */
function checkTranslations() {
  console.log('🔍 检查 i18n 翻译文件...\n')
  
  const translations = {}
  const allKeys = new Set()
  
  // 读取所有语言文件
  for (const lang of SUPPORTED_LANGUAGES) {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`)
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ 语言文件不存在: ${filePath}`)
      process.exit(1)
    }
    
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      translations[lang] = JSON.parse(content)
      
      const keys = getAllKeys(translations[lang])
      keys.forEach(key => allKeys.add(key))
      
      console.log(`✅ ${lang}: ${keys.length} 个翻译键`)
    } catch (error) {
      console.error(`❌ 解析语言文件失败 ${lang}:`, error.message)
      process.exit(1)
    }
  }
  
  console.log(`\n📊 总共发现 ${allKeys.size} 个唯一翻译键\n`)
  
  // 检查缺失的翻译
  let hasMissing = false
  
  for (const lang of SUPPORTED_LANGUAGES) {
    const missingKeys = []
    const extraKeys = []
    
    const langKeys = getAllKeys(translations[lang])
    const langKeysSet = new Set(langKeys)
    
    // 检查缺失的键
    for (const key of allKeys) {
      if (!langKeysSet.has(key)) {
        missingKeys.push(key)
      }
    }
    
    // 检查多余的键
    for (const key of langKeys) {
      if (!allKeys.has(key)) {
        extraKeys.push(key)
      }
    }
    
    if (missingKeys.length > 0) {
      hasMissing = true
      console.log(`❌ ${lang} 缺失 ${missingKeys.length} 个翻译键:`)
      missingKeys.forEach(key => console.log(`   - ${key}`))
      console.log()
    }
    
    if (extraKeys.length > 0) {
      console.log(`⚠️  ${lang} 有 ${extraKeys.length} 个多余的翻译键:`)
      extraKeys.forEach(key => console.log(`   - ${key}`))
      console.log()
    }
    
    if (missingKeys.length === 0 && extraKeys.length === 0) {
      console.log(`✅ ${lang} 翻译完整`)
    }
  }
  
  if (hasMissing) {
    console.log('❌ 发现缺失的翻译，请补充完整后重试')
    process.exit(1)
  } else {
    console.log('🎉 所有翻译文件检查通过！')
  }
}

// 运行检查
checkTranslations()
