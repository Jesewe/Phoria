<div align="center">
   <img src="src/img/icon.png" alt="Phoria" width="200" height="200">
   <h1>Phoria</h1>
   <p>Powerful Tampermonkey userscript for Instagram</p>

[![Downloads](https://img.shields.io/github/downloads/jesewe/Phoria/total?style=for-the-badge&logo=github&color=8E44AD)](https://github.com/Jesewe/Phoria/releases)
[![Latest Release](https://img.shields.io/github/v/release/jesewe/Phoria?style=for-the-badge&logo=github&color=8E44AD)](https://github.com/Jesewe/Phoria/releases/latest/)
[![Ko-fi](https://img.shields.io/badge/ko--fi-support-8E44AD?style=for-the-badge&logo=ko-fi)](https://ko-fi.com/E1E51PAHB3)
[![License](https://img.shields.io/github/license/jesewe/Phoria?style=for-the-badge&color=8E44AD)](LICENSE)

<a href="#features"><strong>Features</strong></a> •
<a href="#installation"><strong>Installation</strong></a> •
<a href="#usage"><strong>Usage</strong></a> •
<a href="#technical-details"><strong>Technical Details</strong></a>

</div>

---

**Phoria** is a powerful Tampermonkey userscript that adds convenient download functionality to Instagram. Download individual photos with a single click or bulk download entire profiles with ease.

## Features

- **Individual Photo Downloads**: Download any photo directly from Instagram posts with a single click
- **Bulk Download**: Download all photos from a profile at once
- **High Resolution**: Automatically selects the highest quality version available
- **Progress Tracking**: Real-time progress bar and statistics during bulk downloads
- **Bilingual Interface**: Full support for English and Russian languages
- **Smart File Naming**: Files are automatically named with username and post ID
- **Rate Limiting**: Built-in delays to prevent triggering Instagram's rate limits
- **Cancel Anytime**: Stop bulk downloads at any point without losing progress

## Installation

### Prerequisites

You need a userscript manager installed in your browser:

- [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
- [Greasemonkey](https://www.greasespot.net/)

### Install Steps

1. Install one of the userscript managers above
2. Click on this link: [Install Phoria](https://github.com/Jesewe/Phoria/raw/main/dist/Phoria.user.js)
3. Your userscript manager will open and ask to confirm installation
4. Click "Install" or "Confirm"
5. Navigate to Instagram and the script will start working automatically

## Usage

### Downloading Individual Photos

1. Navigate to any Instagram profile or post
2. Hover over any photo - you'll see a "Download" button in the top-right corner
3. Click the button to download the photo
4. The file will be saved as `username_postid.jpg`

### Bulk Downloading Profile Photos

1. Navigate to any Instagram profile page
2. **Important**: Scroll down to load all the photos you want to download
3. Click the "Download All Photos" button that appears below the profile header
4. A modal window will appear with instructions
5. Click "Start Download" to begin
6. Monitor the progress bar - you can cancel at any time
7. When complete, all photos will be in your browser's download folder

## Technical Details

### How It Works

1. **Image Detection**: Uses MutationObserver to detect images as they load on the page
2. **Quality Selection**: Parses the `srcset` attribute to find the highest resolution version
3. **Username Extraction**: Intelligently extracts username from URL, meta tags, or page headers
4. **Post ID Extraction**: Locates post IDs from surrounding elements and URLs
5. **Download Mechanism**: Uses Fetch API and Blob URLs for secure, efficient downloads
6. **Rate Limiting**: Implements 800ms delays between bulk downloads to avoid detection

### File Naming Convention

Downloaded files follow this pattern: `{username}_{postid}.jpg`

Example: `jesewe_C123AbC4DeF.jpg`

## Localization

Phoria automatically detects your browser language and displays the interface in:

- **English** (default)
- **Русский** (Russian)

To change the language, simply change your browser's language settings.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
