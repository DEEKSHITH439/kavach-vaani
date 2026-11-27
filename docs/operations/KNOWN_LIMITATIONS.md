# Kavach Vaani – Known Limitations & Operating Boundaries

**Date:** 27 November 2026  
**Auditor:** Senior CTO & Technical Supervisor  

---

## 1. Operating System Voice Pack Availability
- **Limitation:** Standard desktop Windows and macOS installations rarely include regional Indian language text-to-speech packs (Kannada, Tamil, Bengali) by default.
- **System Behavior:** Kavach Vaani detects when an Indic voice pack is missing on the client machine and displays an honest notification rather than playing mangled English phonetics.
- **Resolution Path:** For 100% offline regional speech on desktop, authentic audio recordings (`public/audio/{lang}/{scenario}.mp3`) or Android Chrome devices (which include Google Indic TTS) are recommended.

---

## 2. Indic PDF Text Selectability
- **Limitation:** The generated PDF uses a high-DPI canvas rasterization pipeline to render authentic native Unicode characters (`Nirmala UI`) without font corruption.
- **System Behavior:** The document renders sharply and legibly for printing, but text cannot be highlighted or selected with a mouse cursor.

---

## 3. Sandboxed Government Submission
- **Limitation:** Kavach Vaani generates a simulated reference number (`KV-DEMO-XXXXXX`) and does not connect to live municipal or bank databases.
- **System Behavior:** The application prominently displays a yellow prototype sandbox notice on both the web interface and the generated PDF slip.
