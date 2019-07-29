const vscode = require('vscode')

// Default options
const options = {
  currentColorTheme: null,
  setIntervalId: null,
  msg: 'themeRotator'
}

function activate(context) {
  const config = vscode.workspace.getConfiguration('workbench')

  vscode.commands.registerCommand('theme-rotator.rotateTheme', () => {
    options.currentColorTheme =
      options.currentColorTheme ===
      vscode.workspace.getConfiguration('themeRotator').get('colorTheme')
        ? vscode.workspace
            .getConfiguration('themeRotator')
            .get('alternativeTheme')
        : vscode.workspace.getConfiguration('themeRotator').get('colorTheme')
    config.update('colorTheme', options.currentColorTheme, true)
  })

  var activateEvent = vscode.commands.registerCommand(
    'theme-rotator.activateRotator',
    function() {
      if (options.setIntervalId) {
        clearInterval(options.setIntervalId)
      }

      changeTheme() // Change theme while activating the ext

      options.setIntervalId = setInterval(() => {
        changeTheme()
      }, vscode.workspace.getConfiguration('themeRotator').get('howOften'))

      function changeTheme() {
        if (options.currentColorTheme === null) {
          options.currentColorTheme = vscode.workspace
            .getConfiguration('themeRotator')
            .get('colorTheme')
        }

        if (vscode.workspace.getConfiguration('themeRotator').get('enabled')) {
          options.currentColorTheme =
            options.currentColorTheme ===
            vscode.workspace.getConfiguration('themeRotator').get('colorTheme')
              ? vscode.workspace
                  .getConfiguration('themeRotator')
                  .get('alternativeTheme')
              : vscode.workspace
                  .getConfiguration('themeRotator')
                  .get('colorTheme')
          config.update('colorTheme', options.currentColorTheme, true)
        }
      }
    }
  )

  var deactivateEvent = vscode.commands.registerCommand(
    'theme-rotator.deactivateRotator',
    function() {
      deactivate()
    }
  )

  context.subscriptions.push(activateEvent)
  context.subscriptions.push(deactivateEvent)
}

function deactivate() {
  if (options.setIntervalId) {
    clearInterval(options.setIntervalId)
  }

  vscode.workspace.getConfiguration('themeRotator').update('enabled', false)
}

exports.activate = activate
