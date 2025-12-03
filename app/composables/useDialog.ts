export const useDialog = () => {
    const isOpen = useState<boolean>('dialog_isOpen', () => false)
    const title = useState<string>('dialog_title', () => '')
    const message = useState<string>('dialog_message', () => '')
    const type = useState<'alert' | 'confirm'>('dialog_type', () => 'alert')
    const resolvePromise = useState<((value: boolean) => void) | null>('dialog_resolve', () => null)

    const open = (msg: string, ttl: string = 'Alert', dialogType: 'alert' | 'confirm' = 'alert'): Promise<boolean> => {
        message.value = msg
        title.value = ttl
        type.value = dialogType
        isOpen.value = true

        return new Promise((resolve) => {
            resolvePromise.value = resolve
        })
    }

    const alert = (msg: string, ttl: string = 'Alert') => open(msg, ttl, 'alert')
    const confirm = (msg: string, ttl: string = 'Confirm') => open(msg, ttl, 'confirm')

    const close = (result: boolean) => {
        isOpen.value = false
        if (resolvePromise.value) {
            resolvePromise.value(result)
            resolvePromise.value = null
        }
    }

    return {
        isOpen,
        title,
        message,
        type,
        alert,
        confirm,
        close
    }
}
