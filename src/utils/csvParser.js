/**
 * RFC 4180 compliant CSV parser for EduSpark.
 *
 * Solves:
 * 1. Commas inside quoted text (e.g., "0,7", "4, 6, 8, dan 10", "2,5 jam")
 * 2. Indonesian Excel exports where delimiter is ';' (semicolon)
 * 3. Escaped quotes ("")
 * 4. Multiline text cells (\r\n or \n inside quotes)
 * 5. UTF-8 BOM removal
 * 6. Flexible column headers (English & Indonesian aliases)
 */

export function parseCSVToRows(text) {
  if (!text || typeof text !== 'string') return []

  // Remove UTF-8 BOM if present
  let str = text
  if (str.charCodeAt(0) === 0xfeff) {
    str = str.slice(1)
  }

  // Detect delimiter from first non-quoted record
  let firstLine = ''
  let inQ = false
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (c === '"') {
      if (inQ && str[i + 1] === '"') {
        i++
      } else {
        inQ = !inQ
      }
    } else if (!inQ && (c === '\r' || c === '\n')) {
      break
    } else {
      firstLine += c
    }
  }

  const commaCount = (firstLine.match(/,/g) || []).length
  const semicolonCount = (firstLine.match(/;/g) || []).length
  const delimiter = semicolonCount > commaCount ? ';' : ','

  const rows = []
  let currentRow = []
  let currentCell = ''
  let inQuotes = false

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const nextChar = str[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        currentCell += '"'
        i++
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(cleanCell(currentCell))
      currentCell = ''
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      // Newline outside quotes = record end
      if (char === '\r' && nextChar === '\n') {
        i++
      }
      currentRow.push(cleanCell(currentCell))
      currentCell = ''

      if (currentRow.some((val) => val.length > 0)) {
        rows.push(currentRow)
      }
      currentRow = []
    } else {
      currentCell += char
    }
  }

  // Flush remaining cell
  currentRow.push(cleanCell(currentCell))
  if (currentRow.some((val) => val.length > 0)) {
    rows.push(currentRow)
  }

  return rows
}

function cleanCell(val) {
  if (!val) return ''
  let s = val.trim()
  if (s.startsWith('"') && s.endsWith('"') && s.length >= 2) {
    s = s.slice(1, -1).replace(/""/g, '"').trim()
  }
  return s
}

export function parseExercisesCSV(text) {
  const rows = parseCSVToRows(text)
  if (rows.length < 2) return []

  // Clean headers: lowercase and alphanumeric only
  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))

  const findIndex = (aliases) => {
    return headers.findIndex((h) => aliases.includes(h))
  }

  const topicIdx = findIndex(['topic', 'topik', 'subtes', 'kategori'])
  const questionIdx = findIndex(['question', 'pertanyaan', 'soal'])
  const answerIdx = findIndex(['answer', 'kunci', 'jawaban', 'kuncijawaban'])
  const answerDisplayIdx = findIndex(['answerdisplay', 'tampilanjawaban', 'labeljawaban', 'displayanswer'])
  const explanationIdx = findIndex(['explanation', 'pembahasan', 'penjelasan', 'solusi'])
  const hintIdx = findIndex(['hint', 'petunjuk', 'tips'])

  const results = []

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (!row || row.length === 0 || row.every((c) => !c.trim())) continue

    const getVal = (idx, fallbackIdx = -1) => {
      if (idx !== -1 && row[idx] !== undefined) return row[idx].trim()
      if (fallbackIdx !== -1 && row[fallbackIdx] !== undefined) return row[fallbackIdx].trim()
      return ''
    }

    const question = getVal(questionIdx, 1)
    if (!question) continue // Question is mandatory

    const topic = getVal(topicIdx, 0) || 'Pengetahuan Kuantitatif'
    const answer = getVal(answerIdx, 2)
    const answerDisplay = getVal(answerDisplayIdx) || answer
    const explanation = getVal(explanationIdx, 4) || 'Pembahasan telah disediakan.'
    const hint = getVal(hintIdx, 5)

    results.push({
      id: Date.now() + r,
      topic,
      question: question.replace(/\\n/g, '\n'),
      type: 'input',
      answer,
      answerDisplay,
      explanation: explanation.replace(/\\n/g, '\n'),
      hint,
    })
  }

  return results
}

export function parseMaterialsCSV(text) {
  const rows = parseCSVToRows(text)
  if (rows.length < 2) return []

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))

  const findIndex = (aliases) => {
    return headers.findIndex((h) => aliases.includes(h))
  }

  const titleIdx = findIndex(['title', 'judul', 'topik', 'namamateri'])
  const iconIdx = findIndex(['iconname', 'icon', 'ikon'])
  const premiumIdx = findIndex(['ispremium', 'premium', 'berbayar', 'kuncipremium'])
  const summaryIdx = findIndex(['summary', 'ringkasan', 'deskripsi'])
  const contentIdx = findIndex(['content', 'konten', 'isi', 'materi', 'penjelasan'])
  const mediaTypeIdx = findIndex(['mediatype', 'tipemedia', 'media'])
  const mediaUrlIdx = findIndex(['mediaurl', 'urlmedia', 'linkmedia', 'gambar', 'video'])
  const mediaCaptionIdx = findIndex(['mediacaption', 'keteranganmedia', 'caption'])

  const results = []

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (!row || row.length === 0 || row.every((c) => !c.trim())) continue

    const getVal = (idx, fallbackIdx = -1) => {
      if (idx !== -1 && row[idx] !== undefined) return row[idx].trim()
      if (fallbackIdx !== -1 && row[fallbackIdx] !== undefined) return row[fallbackIdx].trim()
      return ''
    }

    const title = getVal(titleIdx, 0)
    if (!title) continue

    const rawPremium = getVal(premiumIdx, 2).toLowerCase()
    const isPremium =
      rawPremium === 'true' || rawPremium === '1' || rawPremium === 'yes' || rawPremium === 'ya'

    const mediaUrl = getVal(mediaUrlIdx, 6)
    const mediaType =
      getVal(mediaTypeIdx, 5).toLowerCase() === 'video' ? 'video' : 'image'
    const mediaCaption = getVal(mediaCaptionIdx, 7)

    const media = []
    if (mediaUrl) {
      media.push({
        type: mediaType,
        url: mediaUrl,
        caption: mediaCaption,
      })
    }

    results.push({
      id: Date.now() + r,
      title,
      iconName: getVal(iconIdx, 1) || 'BookBookmark',
      isPremium,
      summary: getVal(summaryIdx, 3).replace(/\\n/g, '\n'),
      content: getVal(contentIdx, 4).replace(/\\n/g, '\n'),
      media,
    })
  }

  return results
}

export function parseDiagnosticCSV(text) {
  const rows = parseCSVToRows(text)
  if (rows.length < 2) return []

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''))

  const findIndex = (aliases) => {
    return headers.findIndex((h) => aliases.includes(h))
  }

  const topicIdx = findIndex(['topic', 'topik', 'materi'])
  const subtestIdx = findIndex(['subtest', 'subtes', 'kategori', 'bidang'])
  const questionIdx = findIndex(['question', 'pertanyaan', 'soal', 'soalujian'])
  const optAIdx = findIndex(['optiona', 'opsia', 'pilihana', 'a'])
  const optBIdx = findIndex(['optionb', 'opsib', 'pilihanb', 'b'])
  const optCIdx = findIndex(['optionc', 'opsic', 'pilihanc', 'c'])
  const optDIdx = findIndex(['optiond', 'opsid', 'pilihand', 'd'])
  const correctIdx = findIndex(['correctoption', 'correct', 'kunci', 'jawaban', 'kuncijawaban', 'jawabanbenar'])
  const explanationIdx = findIndex(['explanation', 'pembahasan', 'penjelasan', 'alasan'])

  const results = []

  for (let r = 1; r < rows.length; r++) {
    // Stop if reached 10 questions max
    if (results.length >= 10) break

    const row = rows[r]
    if (!row || row.length === 0 || row.every((c) => !c.trim())) continue

    const getVal = (idx, fallbackIdx = -1) => {
      if (idx !== -1 && row[idx] !== undefined) return row[idx].trim()
      if (fallbackIdx !== -1 && row[fallbackIdx] !== undefined) return row[fallbackIdx].trim()
      return ''
    }

    const questionText = getVal(questionIdx, 2)
    if (!questionText) continue

    const optAText = getVal(optAIdx, 3) || 'Pilihan A'
    const optBText = getVal(optBIdx, 4) || 'Pilihan B'
    const optCText = getVal(optCIdx, 5) || 'Pilihan C'
    const optDText = getVal(optDIdx, 6) || 'Pilihan D'

    const rawCorrect = getVal(correctIdx, 7).toUpperCase()
    let correctLabel = 'A'
    if (rawCorrect.startsWith('B') || rawCorrect === optBText.toUpperCase()) correctLabel = 'B'
    else if (rawCorrect.startsWith('C') || rawCorrect === optCText.toUpperCase()) correctLabel = 'C'
    else if (rawCorrect.startsWith('D') || rawCorrect === optDText.toUpperCase()) correctLabel = 'D'
    else if (rawCorrect.startsWith('A') || rawCorrect === optAText.toUpperCase()) correctLabel = 'A'

    results.push({
      id: Date.now() + r,
      topic: getVal(topicIdx, 0) || 'Penalaran Matematika',
      subtest: getVal(subtestIdx, 1) || 'Pengetahuan Kuantitatif',
      question: questionText.replace(/\\n/g, '\n'),
      options: [
        { label: 'A', text: optAText, correct: correctLabel === 'A' },
        { label: 'B', text: optBText, correct: correctLabel === 'B' },
        { label: 'C', text: optCText, correct: correctLabel === 'C' },
        { label: 'D', text: optDText, correct: correctLabel === 'D' },
      ],
      explanation: getVal(explanationIdx, 8).replace(/\\n/g, '\n') || 'Pembahasan telah disediakan pengajar.',
    })
  }

  return results
}
