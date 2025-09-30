#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * i18n 自动生成脚本
 * 基于中文翻译文件自动生成其他语言的翻译文件
 */

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales')
const SUPPORTED_LANGUAGES = ['zh-CN', 'en-US']
const BASE_LANGUAGE = 'zh-CN'

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
 * 根据键路径获取对象中的值
 * @param {Object} obj 对象
 * @param {string} keyPath 键路径
 * @returns {*} 值
 */
function getValueByPath(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * 根据键路径设置对象中的值
 * @param {Object} obj 对象
 * @param {string} keyPath 键路径
 * @param {*} value 值
 */
function setValueByPath(obj, keyPath, value) {
  const keys = keyPath.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

/**
 * 简单的翻译映射（可以扩展为调用翻译 API）
 */
const TRANSLATION_MAP = {
  'zh-CN': {
    'en-US': {
      '首页': 'Home',
      '服务': 'Services',
      '案例展示': 'Cases',
      '高难度工程': 'Complex Projects',
      '资质证书': 'Certifications',
      '关于我们': 'About Us',
      '联系我们': 'Contact',
      '我们的服务': 'Our Services',
      '专业海洋工程解决方案': 'Professional Marine Engineering Solutions',
      '船舶维修': 'Ship Repair',
      '专业的船舶维修服务，确保您的船舶始终处于最佳状态': 'Professional ship repair services to keep your vessel in optimal condition',
      '定期保养': 'Regular Maintenance',
      '全面的保养计划，延长船舶使用寿命': 'Comprehensive maintenance programs to extend vessel lifespan',
      '翻新改造': 'Refurbishment',
      '现代化改造，提升船舶性能和舒适度': 'Modern upgrades to enhance vessel performance and comfort',
      '关于我们': 'About Us',
      '专业的海洋工程团队': 'Professional Marine Engineering Team',
      '我们拥有多年的海洋工程经验，致力于为客户提供最优质的服务': 'With years of marine engineering experience, we are committed to providing the highest quality services to our clients',
      '联系我们': 'Contact Us',
      '获取专业咨询': 'Get Professional Consultation',
      '电话': 'Phone',
      '邮箱': 'Email',
      '地址': 'Address',
      '© 2024 益阳海洋服务. 保留所有权利.': '© 2024 Yiyang Marine Service. All rights reserved.',
      '隐私政策': 'Privacy Policy',
      '服务条款': 'Terms of Service'
    }
  }
}

/**
 * 翻译文本
 * @param {string} text 文本
 * @param {string} fromLang 源语言
 * @param {string} toLang 目标语言
 * @returns {string} 翻译后的文本
 */
function translateText(text, fromLang, toLang) {
  const map = TRANSLATION_MAP[fromLang]?.[toLang]
  return map?.[text] || `[${text}]` // 如果没有翻译，用方括号标记
}

/**
 * 生成翻译文件
 * @param {Object} baseTranslations 基础翻译对象
 * @param {string} targetLang 目标语言
 * @returns {Object} 翻译后的对象
 */
function generateTranslations(baseTranslations, targetLang) {
  const result = {}
  const keys = getAllKeys(baseTranslations)
  
  for (const key of keys) {
    const value = getValueByPath(baseTranslations, key)
    if (typeof value === 'string') {
      const translatedValue = translateText(value, BASE_LANGUAGE, targetLang)
      setValueByPath(result, key, translatedValue)
    } else {
      setValueByPath(result, key, value)
    }
  }
  
  return result
}

/**
 * 自动生成翻译文件
 */
function autoGenerateTranslations() {
  console.log('🤖 自动生成 i18n 翻译文件...\n')
  
  // 读取基础语言文件
  const baseFilePath = path.join(LOCALES_DIR, `${BASE_LANGUAGE}.json`)
  
  if (!fs.existsSync(baseFilePath)) {
    console.error(`❌ 基础语言文件不存在: ${baseFilePath}`)
    process.exit(1)
  }
  
  let baseTranslations
  try {
    const content = fs.readFileSync(baseFilePath, 'utf8')
    baseTranslations = JSON.parse(content)
    console.log(`✅ 读取基础语言文件: ${BASE_LANGUAGE}`)
  } catch (error) {
    console.error(`❌ 解析基础语言文件失败:`, error.message)
    process.exit(1)
  }
  
  // 为其他语言生成翻译文件
  for (const lang of SUPPORTED_LANGUAGES) {
    if (lang === BASE_LANGUAGE) continue
    
    console.log(`\n🔄 生成 ${lang} 翻译文件...`)
    
    const translations = generateTranslations(baseTranslations, lang)
    const filePath = path.join(LOCALES_DIR, `${lang}.json`)
    
    try {
      const jsonContent = JSON.stringify(translations, null, 2)
      fs.writeFileSync(filePath, jsonContent, 'utf8')
      console.log(`✅ ${lang} 翻译文件已生成: ${filePath}`)
    } catch (error) {
      console.error(`❌ 写入 ${lang} 翻译文件失败:`, error.message)
    }
  }
  
  console.log('\n🎉 翻译文件生成完成！')
  console.log('\n⚠️  注意：自动生成的翻译可能需要人工校对和优化')
}

// 运行自动生成
autoGenerateTranslations()
