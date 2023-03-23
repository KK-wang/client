declare global {
  var sshUtils: {
    [node: string]: {
      ssh: NodeSSH,
      link: () => void,
    }
  }
}

export {}