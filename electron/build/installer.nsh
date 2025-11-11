; ######################################################################
; # Script NSIS customizado para PHPShift
; # Usa IDs numéricos de idioma para máxima compatibilidade.
; ######################################################################

!include "MUI2.nsh"

; --- Variáveis Globais ---
Var desktopShortcutCheckbox
Var runAtStartupCheckbox
Var desktopShortcutCheckboxState
Var runAtStartupCheckboxState

; --- Textos de Tradução (Usando IDs Numéricos) ---
LangString TEXT_CREATE_DESK_SHORTCUT 1033 "Create a &desktop shortcut"
LangString TEXT_CREATE_DESK_SHORTCUT 1046 "Criar um atalho na área de &trabalho"
LangString TEXT_CREATE_DESK_SHORTCUT 1034 "Crear un acceso directo en el &escritorio"
LangString TEXT_CREATE_DESK_SHORTCUT 2052 "创建桌面快捷方式(&d)"

LangString TEXT_RUN_AT_STARTUP 1033 "Launch PHPShift when you &log on to computer"
LangString TEXT_RUN_AT_STARTUP 1046 "Iniciar o PHPShift ao iniciar o &computador"
LangString TEXT_RUN_AT_STARTUP 1034 "Iniciar PHPShift al iniciar &sesión"
LangString TEXT_RUN_AT_STARTUP 2052 "开机时启动 PHPShift(&l)"

LangString TEXT_TASKS_TITLE 1033 "Installation Options"
LangString TEXT_TASKS_TITLE 1046 "Opções de Instalação"
LangString TEXT_TASKS_TITLE 1034 "Opciones de Instalación"
LangString TEXT_TASKS_TITLE 2052 "安装选项"

LangString TEXT_TASKS_SUBTITLE 1033 "Choose additional tasks to be performed."
LangString TEXT_TASKS_SUBTITLE 1046 "Escolha as tarefas adicionais a serem executadas."
LangString TEXT_TASKS_SUBTITLE 1034 "Elija las tareas adicionales que se realizarán."
LangString TEXT_TASKS_SUBTITLE 2052 "选择要执行的附加任务。"

; --- Ações de Instalação/Desinstalação ---
!macro customInstall
  ${If} $desktopShortcutCheckboxState == ${BST_CHECKED}
    CreateShortCut "$DESKTOP\${PRODUCT_NAME}.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  ${EndIf}

  ${If} $runAtStartupCheckboxState == ${BST_CHECKED}
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${PRODUCT_NAME}" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}"'
  ${Else}
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${PRODUCT_NAME}"
  ${EndIf}
!macroend

!macro customUnInstall
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${PRODUCT_NAME}"
!macroend

; --- Definição da Página de Tarefas ---
!macro customUI
  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_DIRECTORY
  
  ; Cria nossa página de tarefas
  Page custom TasksPageCreate TasksPageLeave
  
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH
!macroend

Function TasksPageCreate
  !insertmacro MUI_HEADER_TEXT `$(TEXT_TASKS_TITLE)` `$(TEXT_TASKS_SUBTITLE)`

  nsDialogs::Create 1018
  Pop $0

  ${NSD_CreateCheckbox} 12u 12u 280u 12u `$(TEXT_CREATE_DESK_SHORTCUT)`
  Pop $desktopShortcutCheckbox
  ${NSD_SetState} $desktopShortcutCheckbox ${BST_CHECKED}

  ${NSD_CreateCheckbox} 12u 32u 280u 12u `$(TEXT_RUN_AT_STARTUP)`
  Pop $runAtStartupCheckbox
  ${NSD_SetState} $runAtStartupCheckbox ${BST_CHECKED}
  
  nsDialogs::Show
FunctionEnd

Function TasksPageLeave
  ${NSD_GetState} $desktopShortcutCheckbox $desktopShortcutCheckboxState
  ${NSD_GetState} $runAtStartupCheckbox $runAtStartupCheckboxState
FunctionEnd