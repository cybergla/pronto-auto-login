# Pronto Auto Login

<p align="center">
  <img src="icon128.png" alt="Pronto Auto Login Logo" width="128"/>
</p>

A Chrome extension that automatically logs you into VOLSBB (VIT College WiFi). Save your credentials once and login with a single click.

## Features

- 🚀 One-click login to VOLSBB
- 🔒 Securely store credentials
- 📱 Clean, modern interface
- 🔔 Desktop notifications for login status
- ⚡ Automatic form filling

## Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/your-extension-id)
2. Click "Add to Chrome"

### Manual Installation (Development)
1. Clone this repository
   ```bash
   git clone https://github.com/cybergla/pronto-auto-login.git
   ```
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension directory

## How to Use

1. Click the extension icon in your Chrome toolbar
2. Enter your VOLSBB credentials
3. Click "Save" to store your credentials
4. Use "Login" button for one-click login
5. Use "Logout" when you're done

## Privacy & Security

- Credentials are stored locally in Chrome's secure storage
- No data is transmitted to external servers
- All communication is directly with the VOLSBB authentication server

## Development

### Project Structure

```
pronto-auto-login/
├── manifest.json # Extension configuration
├── popup.html # Extension popup interface
├── popup.js # Popup logic
├── content.js # Page interaction logic
├── service_worker.js # Background processes
└── icons/ # Extension icons
```

### Building from Source
1. Make your changes
2. Test using "Load unpacked" in Chrome
3. Package using Chrome's "Pack Extension"

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits

- Icons from [Noun Project](https://thenounproject.com) by Remy Medard and Alex Auda Samora
- Built with ❤️ by [Tanay Deshmukh](https://github.com/cybergla)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Version History

- v0.2.6 - Current stable release
- [View all versions](https://github.com/cybergla/pronto-auto-login/releases)

## Support

Found a bug? [Create an issue](https://github.com/cybergla/pronto-auto-login/issues)
