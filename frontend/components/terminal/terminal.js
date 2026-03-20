// terminal.js — Simulated Linux terminal with fake FS

(function () {
  // ── Filesystem ─────────────────────────────
  var FS = {
    '/': {
      type: 'd',
      perm: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        etc: {
          type: 'd',
          perm: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            passwd: {
              type: 'f',
              perm: '-rw-r--r--',
              owner: 'root',
              group: 'root',
              size: 2847,
              content:
                'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nuser:x:1000:1000:user:/home/user:/bin/bash\nnewuser:x:1001:1001::/home/newuser:/bin/bash',
            },
            shadow: {
              type: 'f',
              perm: '-rw-r-----',
              owner: 'root',
              group: 'shadow',
              size: 1284,
              content:
                'root:$6$xyz...hashed...abc:19000:0:99999:7:::\nuser:$6$abc...hashed...xyz:19000:0:99999:7:::',
            },
            hostname: {
              type: 'f',
              perm: '-rw-r--r--',
              owner: 'root',
              group: 'root',
              size: 14,
              content: 'cyberpark',
            },
            ssh: {
              type: 'd',
              perm: 'drwxr-xr-x',
              owner: 'root',
              group: 'root',
              children: {
                sshd_config: {
                  type: 'f',
                  perm: '-rw-r--r--',
                  owner: 'root',
                  group: 'root',
                  size: 338,
                  content:
                    '# SSH Server Configuration\nPort 22\nPermitRootLogin no\nPasswordAuthentication yes\nPubkeyAuthentication yes\nMaxAuthTries 3',
                },
              },
            },
            group: {
              type: 'f',
              perm: '-rw-r--r--',
              owner: 'root',
              group: 'root',
              size: 512,
              content:
                'root:x:0:\ndaemon:x:1:\nbin:x:2:\nsys:x:3:\nsudo:x:27:user\nuser:x:1000:\nnewuser:x:1001:',
            },
          },
        },
        home: {
          type: 'd',
          perm: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            user: {
              type: 'd',
              perm: 'drwxr-xr-x',
              owner: 'user',
              group: 'user',
              children: {
                documents: {
                  type: 'd',
                  perm: 'drwxr-xr-x',
                  owner: 'user',
                  group: 'user',
                  children: {
                    'notes.txt': {
                      type: 'f',
                      perm: '-rw-r--r--',
                      owner: 'user',
                      group: 'user',
                      size: 86,
                      content:
                        'Security Notes:\n- Always check /var/log for suspicious activity\n- Use chmod 600 for sensitive files',
                    },
                    'secret.txt': {
                      type: 'f',
                      perm: '-rw-------',
                      owner: 'user',
                      group: 'user',
                      size: 45,
                      content:
                        'This is a secret file with restricted permissions.',
                    },
                  },
                },
                captures: {
                  type: 'd',
                  perm: 'drwxr-xr-x',
                  owner: 'user',
                  group: 'user',
                  children: {
                    'capture.pcap': {
                      type: 'f',
                      perm: '-rw-r--r--',
                      owner: 'user',
                      group: 'user',
                      size: 24576,
                      content:
                        '[pcap binary data — use tcpdump -r or tshark -r to read]',
                    },
                    'suspicious.pcap': {
                      type: 'f',
                      perm: '-rw-r--r--',
                      owner: 'user',
                      group: 'user',
                      size: 8192,
                      content:
                        '[pcap binary data — use tcpdump -r or tshark -r to read]',
                    },
                  },
                },
                scripts: {
                  type: 'd',
                  perm: 'drwxr-xr-x',
                  owner: 'user',
                  group: 'user',
                  children: {
                    'backup.sh': {
                      type: 'f',
                      perm: '-rwxr-xr-x',
                      owner: 'user',
                      group: 'user',
                      size: 156,
                      content:
                        '#!/bin/bash\n# Backup script\ntar -czf /tmp/backup.tar.gz /home/user/documents\necho "Backup complete."',
                    },
                    'monitor.sh': {
                      type: 'f',
                      perm: '-rwxr-xr-x',
                      owner: 'user',
                      group: 'user',
                      size: 220,
                      content:
                        '#!/bin/bash\n# Security Log Monitor\nLOG="/var/log/auth.log"\ngrep "Failed password" $LOG | tail -10\necho "[*] Check complete."',
                    },
                  },
                },
              },
            },
          },
        },
        var: {
          type: 'd',
          perm: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            log: {
              type: 'd',
              perm: 'drwxr-xr-x',
              owner: 'root',
              group: 'root',
              children: {
                'auth.log': {
                  type: 'f',
                  perm: '-rw-r-----',
                  owner: 'root',
                  group: 'adm',
                  size: 4096,
                  content:
                    'Jan 15 10:30:01 cyberpark sshd[1234]: Failed password for root from 192.168.1.100 port 22\nJan 15 10:30:05 cyberpark sshd[1234]: Failed password for root from 192.168.1.100 port 22\nJan 15 10:30:10 cyberpark sshd[1234]: Failed password for admin from 10.0.0.5 port 22\nJan 15 10:31:00 cyberpark sshd[1235]: Accepted publickey for user from 192.168.1.50 port 22\nJan 15 10:32:00 cyberpark sudo: user : TTY=pts/0 ; PWD=/home/user ; COMMAND=/bin/cat /etc/shadow',
                },
                syslog: {
                  type: 'f',
                  perm: '-rw-r-----',
                  owner: 'root',
                  group: 'adm',
                  size: 2048,
                  content:
                    'Jan 15 10:00:01 cyberpark systemd[1]: Started Session 1 of user user.\nJan 15 10:05:00 cyberpark cron[500]: (root) CMD (test -x /usr/sbin/anacron)\nJan 15 10:10:00 cyberpark kernel: [UFW BLOCK] IN=eth0 SRC=10.0.0.99 DST=192.168.1.10 PROTO=TCP DPT=443\nJan 15 10:15:00 cyberpark sshd[1234]: error: maximum authentication attempts exceeded',
                },
              },
            },
          },
        },
        tmp: {
          type: 'd',
          perm: 'drwxrwxrwt',
          owner: 'root',
          group: 'root',
          children: {
            'test.txt': {
              type: 'f',
              perm: '-rw-r--r--',
              owner: 'user',
              group: 'user',
              size: 28,
              content: 'This is a temporary test file.',
            },
          },
        },
        bin: {
          type: 'd',
          perm: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            bash: {
              type: 'f',
              perm: '-rwxr-xr-x',
              owner: 'root',
              group: 'root',
              size: 1113504,
              content: '',
            },
            ls: {
              type: 'f',
              perm: '-rwxr-xr-x',
              owner: 'root',
              group: 'root',
              size: 133792,
              content: '',
            },
            cat: {
              type: 'f',
              perm: '-rwxr-xr-x',
              owner: 'root',
              group: 'root',
              size: 35064,
              content: '',
            },
            grep: {
              type: 'f',
              perm: '-rwxr-xr-x',
              owner: 'root',
              group: 'root',
              size: 203688,
              content: '',
            },
          },
        },
        sbin: {
          type: 'd',
          perm: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {},
        },
      },
    },
  };

  // ── State ─────────────────────────────────
  var cwd = '/home/user';
  var user = 'user';
  var hostname = 'cyberpark';
  var cmdHistory = [];
  var historyIndex = -1;

  // ── Helper: resolve path ──────────────────
  function resolvePath(path) {
    if (!path) return cwd;
    if (path === '~') return '/home/user';
    if (path.startsWith('~/')) path = '/home/user/' + path.substring(2);
    if (!path.startsWith('/')) path = cwd + '/' + path;
    // normalize
    var parts = path.split('/').filter(Boolean);
    var stack = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === '..') {
        stack.pop();
      } else if (parts[i] !== '.') {
        stack.push(parts[i]);
      }
    }
    return '/' + stack.join('/');
  }

  function getNode(path) {
    if (path === '/') return FS['/'];
    var parts = path.split('/').filter(Boolean);
    var node = FS['/'];
    for (var i = 0; i < parts.length; i++) {
      if (!node.children || !node.children[parts[i]]) return null;
      node = node.children[parts[i]];
    }
    return node;
  }

  function getPrompt() {
    var displayPath = cwd;
    if (cwd === '/home/user') displayPath = '~';
    else if (cwd.startsWith('/home/user/'))
      displayPath = '~' + cwd.substring(10);
    return user + '@' + hostname + ':' + displayPath + '$ ';
  }

  // ── Commands ──────────────────────────────
  var commands = {};

  commands.help = function () {
    return [
      'Available commands:',
      '  pwd              Show current directory',
      '  ls [-la] [path]  List files',
      '  cd [path]        Change directory',
      '  cat <file>       Show file content',
      '  mkdir <name>     Create directory',
      '  touch <name>     Create empty file',
      '  chmod <mode> <f> Change permissions',
      '  whoami           Show current user',
      '  id               Show user/group info',
      '  grep <pattern> <file>  Search in file',
      '  find <path> [-name pattern | -perm mode]',
      '  ps aux           Show processes',
      '  netstat -tulnp   Show network connections',
      '',
      '  === Network Security ===',
      '  ifconfig / ip addr  Show network interfaces',
      '  ping <host>         Ping a host',
      '  nmap <target>       Port scan',
      '  tcpdump [opts]      Capture packets',
      '  tshark [opts]       Wireshark CLI',
      '  arp -a              Show ARP table',
      '  nslookup <domain>   DNS lookup',
      '',
      '  clear            Clear terminal',
      '  history          Show command history',
      '  help             Show this help',
    ].join('\n');
  };

  commands.pwd = function () {
    return cwd;
  };

  commands.whoami = function () {
    return user;
  };

  commands.id = function () {
    return 'uid=1000(user) gid=1000(user) groups=1000(user),27(sudo)';
  };

  commands.groups = function () {
    return 'user sudo';
  };

  commands.w = function () {
    return (
      'USER     TTY      FROM             LOGIN@   IDLE   WHAT\n' +
      'user     pts/0    192.168.1.50     10:31    0.00s  bash'
    );
  };
  commands.who = commands.w;

  commands.hostname = function () {
    return hostname;
  };

  commands.ps = function (args) {
    return (
      '  PID TTY          TIME CMD\n' +
      '    1 ?        00:00:03 systemd\n' +
      '  500 ?        00:00:01 cron\n' +
      ' 1234 ?        00:00:00 sshd\n' +
      ' 1235 ?        00:00:00 sshd\n' +
      ' 2001 pts/0    00:00:00 bash\n' +
      ' 2050 pts/0    00:00:00 ps'
    );
  };

  commands.ls = function (args) {
    var showAll = false,
      showLong = false;
    var targetPath = null;
    for (var i = 0; i < args.length; i++) {
      if (args[i] === '-la' || args[i] === '-al') {
        showAll = true;
        showLong = true;
      } else if (args[i] === '-l') {
        showLong = true;
      } else if (args[i] === '-a') {
        showAll = true;
      } else {
        targetPath = args[i];
      }
    }
    var path = resolvePath(targetPath);
    var node = getNode(path);
    if (!node)
      return err(
        "ls: cannot access '" +
          (targetPath || path) +
          "': No such file or directory",
      );
    if (node.type === 'f') {
      if (showLong)
        return (
          node.perm +
          ' 1 ' +
          node.owner +
          ' ' +
          node.group +
          ' ' +
          (node.size || 0) +
          ' Jan 15 10:30 ' +
          (targetPath || path).split('/').pop()
        );
      return (targetPath || path).split('/').pop();
    }
    var entries = Object.keys(node.children || {});
    if (!showAll)
      entries = entries.filter(function (e) {
        return !e.startsWith('.');
      });
    if (showLong) {
      var lines = ['total ' + entries.length];
      if (showAll) {
        lines.push('drwxr-xr-x . ');
        lines.push('drwxr-xr-x .. ');
      }
      entries.forEach(function (name) {
        var child = node.children[name];
        var sizeStr = child.type === 'd' ? '4096' : String(child.size || 0);
        lines.push(
          child.perm +
            ' 1 ' +
            child.owner +
            ' ' +
            child.group +
            ' ' +
            padLeft(sizeStr, 8) +
            ' Jan 15 10:30 ' +
            name,
        );
      });
      return lines.join('\n');
    }
    return entries
      .map(function (name) {
        var child = node.children[name];
        return child.type === 'd'
          ? '<span class="sim-dir">' + name + '/</span>'
          : child.perm && child.perm.indexOf('x') > 3
            ? '<span class="sim-exec">' + name + '</span>'
            : name;
      })
      .join('  ');
  };

  commands.cd = function (args) {
    var target = args[0] || '~';
    var path = resolvePath(target);
    var node = getNode(path);
    if (!node) return err('cd: ' + target + ': No such file or directory');
    if (node.type !== 'd') return err('cd: ' + target + ': Not a directory');
    cwd = path;
    updatePromptLabel();
    return '';
  };

  commands.cat = function (args) {
    if (!args[0]) return err('cat: missing file operand');
    var path = resolvePath(args[0]);
    var node = getNode(path);
    if (!node) return err('cat: ' + args[0] + ': No such file or directory');
    if (node.type === 'd') return err('cat: ' + args[0] + ': Is a directory');
    return node.content || '';
  };

  commands.mkdir = function (args) {
    if (!args[0]) return err('mkdir: missing operand');
    var parentPath = cwd;
    var name = args[0];
    var parent = getNode(parentPath);
    if (!parent || parent.type !== 'd')
      return err('mkdir: cannot create directory');
    if (parent.children[name])
      return err("mkdir: cannot create directory '" + name + "': File exists");
    parent.children[name] = {
      type: 'd',
      perm: 'drwxr-xr-x',
      owner: user,
      group: user,
      children: {},
    };
    return '';
  };

  commands.touch = function (args) {
    if (!args[0]) return err('touch: missing file operand');
    var parent = getNode(cwd);
    if (!parent || parent.type !== 'd') return err('touch: cannot create file');
    if (!parent.children[args[0]]) {
      parent.children[args[0]] = {
        type: 'f',
        perm: '-rw-r--r--',
        owner: user,
        group: user,
        size: 0,
        content: '',
      };
    }
    return '';
  };

  commands.chmod = function (args) {
    if (args.length < 2) return err('chmod: missing operand');
    var mode = args[0];
    var path = resolvePath(args[1]);
    var node = getNode(path);
    if (!node)
      return err(
        "chmod: cannot access '" + args[1] + "': No such file or directory",
      );
    // simple octal conversion
    var modeMap = {
      0: '---',
      1: '--x',
      2: '-w-',
      3: '-wx',
      4: 'r--',
      5: 'r-x',
      6: 'rw-',
      7: 'rwx',
    };
    if (/^[0-7]{3}$/.test(mode)) {
      var prefix = node.type === 'd' ? 'd' : '-';
      node.perm =
        prefix + modeMap[mode[0]] + modeMap[mode[1]] + modeMap[mode[2]];
      return '';
    }
    return err("chmod: invalid mode: '" + mode + "'");
  };

  commands.grep = function (args) {
    if (args.length < 2)
      return err('grep: missing arguments\nUsage: grep <pattern> <file>');
    var pattern = args[0].replace(/['"]/g, '');
    var path = resolvePath(args[1]);
    var node = getNode(path);
    if (!node) return err('grep: ' + args[1] + ': No such file or directory');
    if (node.type === 'd') return err('grep: ' + args[1] + ': Is a directory');
    var lines = (node.content || '').split('\n');
    var matches = lines.filter(function (line) {
      return line.toLowerCase().indexOf(pattern.toLowerCase()) !== -1;
    });
    if (matches.length === 0) return '';
    return matches
      .map(function (line) {
        return line.replace(
          new RegExp('(' + escapeRegex(pattern) + ')', 'gi'),
          '<span style="color:#ff5f57;font-weight:bold">$1</span>',
        );
      })
      .join('\n');
  };

  commands.find = function (args) {
    if (args.length === 0) args = ['.'];
    var searchPath = resolvePath(args[0]);
    var namePattern = null,
      permPattern = null;
    for (var i = 1; i < args.length; i++) {
      if (args[i] === '-name' && args[i + 1]) {
        namePattern = args[++i];
      }
      if (args[i] === '-perm' && args[i + 1]) {
        permPattern = args[++i];
      }
    }
    var results = [];
    function walk(path, node) {
      var fullPath = path === '/' ? '/' + '' : path;
      var name = fullPath.split('/').pop();
      var match = true;
      if (namePattern) {
        var pat = namePattern.replace(/\*/g, '.*');
        match = new RegExp('^' + pat + '$').test(name);
      }
      if (permPattern && node.perm) {
        // SUID check: -4000 means any file with 's' in perm
        if (permPattern === '-4000') {
          match = match && node.perm.indexOf('s') !== -1;
        }
      }
      if (match && (namePattern || permPattern)) results.push(fullPath || '/');
      if (!namePattern && !permPattern) results.push(fullPath || '/');
      if (node.children) {
        Object.keys(node.children).forEach(function (child) {
          walk(fullPath + '/' + child, node.children[child]);
        });
      }
    }
    var startNode = getNode(searchPath);
    if (!startNode)
      return err("find: '" + args[0] + "': No such file or directory");
    walk(searchPath === '/' ? '' : searchPath, startNode);
    return results.join('\n');
  };

  commands.clear = function () {
    outputEl.innerHTML = '';
    return '';
  };

  commands.history = function () {
    return cmdHistory
      .map(function (cmd, i) {
        return padLeft(String(i + 1), 5) + '  ' + cmd;
      })
      .join('\n');
  };

  commands.echo = function (args) {
    return args.join(' ').replace(/['"]/g, '');
  };

  commands.uname = function (args) {
    if (args[0] === '-a')
      return 'Linux cyberpark 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux';
    return 'Linux';
  };

  commands.netstat = function () {
    return (
      'Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program\n' +
      'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1234/sshd\n' +
      'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      1500/nginx\n' +
      'tcp        0     36 192.168.1.10:22          192.168.1.50:54321      ESTABLISHED 1235/sshd'
    );
  };
  commands.ss = commands.netstat;

  // ── Network Security Commands ─────────────
  commands.ifconfig = function () {
    return (
      'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n' +
      '        inet 192.168.1.10  netmask 255.255.255.0  broadcast 192.168.1.255\n' +
      '        inet6 fe80::a00:27ff:fe4e:1234  prefixlen 64  scopeid 0x20\n' +
      '        ether 08:00:27:4e:12:34  txqueuelen 1000\n' +
      '        RX packets 15234  bytes 12345678 (11.7 MiB)\n' +
      '        TX packets 8921  bytes 654321 (639.0 KiB)\n\n' +
      'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n' +
      '        inet 127.0.0.1  netmask 255.0.0.0\n' +
      '        inet6 ::1  prefixlen 128  scopeid 0x10\n' +
      '        loop  txqueuelen 1000'
    );
  };

  commands.ip = function (args) {
    if (args[0] === 'addr' || args[0] === 'a') {
      return (
        '1: lo: <LOOPBACK,UP> mtu 65536\n' +
        '    inet 127.0.0.1/8 scope host lo\n' +
        '2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n' +
        '    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0\n' +
        '    link/ether 08:00:27:4e:12:34 brd ff:ff:ff:ff:ff:ff'
      );
    }
    if (args[0] === 'route' || args[0] === 'r') {
      return (
        'default via 192.168.1.1 dev eth0 proto dhcp\n' +
        '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10'
      );
    }
    return err('Usage: ip addr | ip route');
  };

  commands.ping = function (args) {
    var target = args.filter(function (a) {
      return !a.startsWith('-');
    })[0];
    if (!target) return err('ping: missing host operand');
    var ip =
      target === 'localhost'
        ? '127.0.0.1'
        : target.match(/^\d/)
          ? target
          : '142.250.199.100';
    return (
      'PING ' +
      target +
      ' (' +
      ip +
      ') 56(84) bytes of data.\n' +
      '64 bytes from ' +
      ip +
      ': icmp_seq=1 ttl=117 time=12.3 ms\n' +
      '64 bytes from ' +
      ip +
      ': icmp_seq=2 ttl=117 time=11.8 ms\n' +
      '64 bytes from ' +
      ip +
      ': icmp_seq=3 ttl=117 time=12.1 ms\n' +
      '64 bytes from ' +
      ip +
      ': icmp_seq=4 ttl=117 time=11.9 ms\n\n' +
      '--- ' +
      target +
      ' ping statistics ---\n' +
      '4 packets transmitted, 4 received, 0% packet loss, time 3004ms\n' +
      'rtt min/avg/max/mdev = 11.8/12.0/12.3/0.2 ms'
    );
  };

  commands.arp = function (args) {
    return (
      '? (192.168.1.1) at 00:1a:2b:3c:4d:5e [ether] on eth0\n' +
      '? (192.168.1.50) at 08:00:27:ab:cd:ef [ether] on eth0\n' +
      '? (192.168.1.100) at aa:bb:cc:dd:ee:ff [ether] on eth0\n' +
      '? (10.0.0.5) at 11:22:33:44:55:66 [ether] on eth0'
    );
  };

  commands.nslookup = function (args) {
    var domain = args[0];
    if (!domain) return err('Usage: nslookup <domain>');
    return (
      'Server:\t\t8.8.8.8\n' +
      'Address:\t8.8.8.8#53\n\n' +
      'Non-authoritative answer:\n' +
      'Name:\t' +
      domain +
      '\n' +
      'Address: 142.250.199.100\n' +
      'Name:\t' +
      domain +
      '\n' +
      'Address: 2404:6800:4003:c04::64'
    );
  };
  commands.dig = commands.nslookup;

  commands.nmap = function (args) {
    var target = args.filter(function (a) {
      return !a.startsWith('-');
    })[0];
    if (!target) return err('Usage: nmap <target>');
    var ip = target.match(/^\d/) ? target : '142.250.199.100';
    return (
      'Starting Nmap 7.93 ( https://nmap.org )\n' +
      'Nmap scan report for ' +
      target +
      ' (' +
      ip +
      ')\n' +
      'Host is up (0.012s latency).\n\n' +
      'PORT      STATE    SERVICE\n' +
      '<span class="sim-exec">22/tcp    open     ssh</span>\n' +
      '<span class="sim-exec">80/tcp    open     http</span>\n' +
      '<span class="sim-exec">443/tcp   open     https</span>\n' +
      '<span class="sim-err">3306/tcp  filtered mysql</span>\n' +
      '8080/tcp  closed   http-proxy\n\n' +
      'Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds'
    );
  };

  commands.tcpdump = function (args) {
    var readFile = null,
      iface = 'eth0',
      portFilter = null,
      hostFilter = null,
      showHex = false,
      count = 10;
    for (var i = 0; i < args.length; i++) {
      if (args[i] === '-r' && args[i + 1]) readFile = args[++i];
      else if (args[i] === '-i' && args[i + 1]) iface = args[++i];
      else if (args[i] === '-X') showHex = true;
      else if (args[i] === '-n') {
        /* no-resolve, ignored */
      } else if (args[i] === '-c' && args[i + 1]) count = parseInt(args[++i]);
      else if (args[i] === 'port' && args[i + 1]) portFilter = args[++i];
      else if (args[i] === 'host' && args[i + 1]) hostFilter = args[++i];
    }
    // Simulated capture data
    var packets = [
      {
        time: '10:30:01.123',
        src: '192.168.1.100',
        sp: '50001',
        dst: '93.184.216.34',
        dp: '443',
        flags: 'S',
        proto: 'tcp',
        info: 'Flags [S], seq 1000',
      },
      {
        time: '10:30:01.145',
        src: '93.184.216.34',
        sp: '443',
        dst: '192.168.1.100',
        dp: '50001',
        flags: 'S.',
        proto: 'tcp',
        info: 'Flags [S.], seq 2000, ack 1001',
      },
      {
        time: '10:30:01.146',
        src: '192.168.1.100',
        sp: '50001',
        dst: '93.184.216.34',
        dp: '443',
        flags: '.',
        proto: 'tcp',
        info: 'Flags [.], ack 2001',
      },
      {
        time: '10:30:01.200',
        src: '192.168.1.100',
        sp: '50001',
        dst: '93.184.216.34',
        dp: '443',
        flags: 'P.',
        proto: 'tcp',
        info: 'Flags [P.], length 517 (TLS Client Hello)',
      },
      {
        time: '10:30:02.100',
        src: '192.168.1.100',
        sp: '54321',
        dst: '8.8.8.8',
        dp: '53',
        flags: '',
        proto: 'udp',
        info: 'DNS query A example.com',
      },
      {
        time: '10:30:02.125',
        src: '8.8.8.8',
        sp: '53',
        dst: '192.168.1.100',
        dp: '54321',
        flags: '',
        proto: 'udp',
        info: 'DNS response A 93.184.216.34',
      },
      {
        time: '10:30:03.300',
        src: '10.0.0.99',
        sp: '44444',
        dst: '192.168.1.10',
        dp: '22',
        flags: 'S',
        proto: 'tcp',
        info: 'Flags [S], seq 9999 <span class="sim-err">[SSH scan]</span>',
      },
      {
        time: '10:30:03.301',
        src: '192.168.1.10',
        sp: '22',
        dst: '10.0.0.99',
        dp: '44444',
        flags: 'S.',
        proto: 'tcp',
        info: 'Flags [S.], seq 5000, ack 10000',
      },
      {
        time: '10:30:04.000',
        src: '192.168.1.100',
        sp: '50002',
        dst: '93.184.216.34',
        dp: '80',
        flags: 'S',
        proto: 'tcp',
        info: 'Flags [S], seq 3000',
      },
      {
        time: '10:30:04.020',
        src: '93.184.216.34',
        sp: '80',
        dst: '192.168.1.100',
        dp: '50002',
        flags: 'S.',
        proto: 'tcp',
        info: 'Flags [S.], seq 4000, ack 3001',
      },
      {
        time: '10:30:04.021',
        src: '192.168.1.100',
        sp: '50002',
        dst: '93.184.216.34',
        dp: '80',
        flags: 'P.',
        proto: 'tcp',
        info: 'Flags [P.], length 89 (HTTP GET /index.html)',
      },
      {
        time: '10:30:04.050',
        src: '93.184.216.34',
        sp: '80',
        dst: '192.168.1.100',
        dp: '50002',
        flags: 'P.',
        proto: 'tcp',
        info: 'Flags [P.], length 1256 (HTTP 200 OK)',
      },
    ];
    // Apply filters
    var filtered = packets.filter(function (p) {
      if (portFilter && p.sp !== portFilter && p.dp !== portFilter)
        return false;
      if (hostFilter && p.src !== hostFilter && p.dst !== hostFilter)
        return false;
      return true;
    });
    if (filtered.length === 0)
      return '<span class="sim-info">No packets matched the filter.</span>';
    var lines = [];
    if (readFile)
      lines.push(
        '<span class="sim-info">reading from file ' +
          readFile +
          ', link-type EN10MB (Ethernet)</span>',
      );
    else
      lines.push(
        '<span class="sim-info">tcpdump: listening on ' +
          iface +
          ', link-type EN10MB (Ethernet)</span>',
      );
    filtered.slice(0, count).forEach(function (p) {
      lines.push(
        p.time +
          ' IP ' +
          p.src +
          '.' +
          p.sp +
          ' > ' +
          p.dst +
          '.' +
          p.dp +
          ': ' +
          p.info,
      );
      if (showHex) {
        lines.push('  0x0000:  4500 003c 0000 4000 4006 0000 c0a8 0164');
        lines.push('  0x0010:  c0a8 0101 c350 0050 0000 0000 0000 0000');
      }
    });
    lines.push(
      '\n<span class="sim-info">' +
        filtered.slice(0, count).length +
        ' packets captured</span>',
    );
    return lines.join('\n');
  };

  commands.tshark = function (args) {
    var readFile = null,
      displayFilter = null;
    for (var i = 0; i < args.length; i++) {
      if (args[i] === '-r' && args[i + 1]) readFile = args[++i];
      else if (args[i] === '-Y' && args[i + 1])
        displayFilter = args[++i].replace(/["']/g, '');
      else if (args[i] === '-i') i++; // skip interface
    }
    var rows = [
      {
        no: 1,
        time: '0.000000',
        src: '192.168.1.100',
        dst: '93.184.216.34',
        proto: 'TCP',
        len: 74,
        info: '50001 → 443 [SYN] Seq=0',
      },
      {
        no: 2,
        time: '0.022000',
        src: '93.184.216.34',
        dst: '192.168.1.100',
        proto: 'TCP',
        len: 74,
        info: '443 → 50001 [SYN, ACK] Seq=0 Ack=1',
      },
      {
        no: 3,
        time: '0.023000',
        src: '192.168.1.100',
        dst: '93.184.216.34',
        proto: 'TCP',
        len: 66,
        info: '50001 → 443 [ACK] Seq=1 Ack=1',
      },
      {
        no: 4,
        time: '0.077000',
        src: '192.168.1.100',
        dst: '93.184.216.34',
        proto: 'TLS',
        len: 583,
        info: 'Client Hello',
      },
      {
        no: 5,
        time: '0.977000',
        src: '192.168.1.100',
        dst: '8.8.8.8',
        proto: 'DNS',
        len: 72,
        info: 'Standard query A example.com',
      },
      {
        no: 6,
        time: '1.002000',
        src: '8.8.8.8',
        dst: '192.168.1.100',
        proto: 'DNS',
        len: 88,
        info: 'Standard query response A 93.184.216.34',
      },
      {
        no: 7,
        time: '2.177000',
        src: '10.0.0.99',
        dst: '192.168.1.10',
        proto: 'TCP',
        len: 74,
        info: '44444 → 22 [SYN] Seq=0 <span class="sim-err">[SCAN]</span>',
      },
      {
        no: 8,
        time: '2.900000',
        src: '192.168.1.100',
        dst: '93.184.216.34',
        proto: 'HTTP',
        len: 155,
        info: 'GET /index.html HTTP/1.1',
      },
      {
        no: 9,
        time: '2.930000',
        src: '93.184.216.34',
        dst: '192.168.1.100',
        proto: 'HTTP',
        len: 1322,
        info: 'HTTP/1.1 200 OK (text/html)',
      },
      {
        no: 10,
        time: '3.500000',
        src: '192.168.1.100',
        dst: '192.168.1.1',
        proto: 'ARP',
        len: 42,
        info: 'Who has 192.168.1.1? Tell 192.168.1.100',
      },
    ];
    // Filter
    if (displayFilter) {
      var df = displayFilter.toLowerCase();
      rows = rows.filter(function (r) {
        if (df === 'http') return r.proto === 'HTTP';
        if (df === 'dns') return r.proto === 'DNS';
        if (df === 'tcp')
          return r.proto === 'TCP' || r.proto === 'TLS' || r.proto === 'HTTP';
        if (df === 'arp') return r.proto === 'ARP';
        if (df === 'tls') return r.proto === 'TLS';
        if (df.indexOf('ip.src') !== -1) {
          var m = df.match(/[\d.]+/);
          return m && r.src === m[0];
        }
        if (df.indexOf('tcp.flags.syn') !== -1)
          return r.info.indexOf('[SYN]') !== -1;
        return true;
      });
    }
    if (rows.length === 0)
      return '<span class="sim-info">No packets matched display filter.</span>';
    var header =
      padLeft('No.', 5) +
      '  ' +
      padLeft('Time', 10) +
      '  ' +
      padLeft('Source', 18) +
      '  ' +
      padLeft('Destination', 18) +
      '  ' +
      padLeft('Proto', 6) +
      '  ' +
      padLeft('Len', 5) +
      '  Info';
    var lines = [header];
    rows.forEach(function (r) {
      lines.push(
        padLeft(String(r.no), 5) +
          '  ' +
          padLeft(r.time, 10) +
          '  ' +
          padLeft(r.src, 18) +
          '  ' +
          padLeft(r.dst, 18) +
          '  ' +
          padLeft(r.proto, 6) +
          '  ' +
          padLeft(String(r.len), 5) +
          '  ' +
          r.info,
      );
    });
    return lines.join('\n');
  };

  commands.traceroute = function (args) {
    var target = args[0] || 'google.com';
    return (
      'traceroute to ' +
      target +
      ', 30 hops max, 60 byte packets\n' +
      ' 1  192.168.1.1 (192.168.1.1)  1.234 ms  1.100 ms  0.987 ms\n' +
      ' 2  10.10.0.1 (10.10.0.1)  5.432 ms  5.321 ms  5.210 ms\n' +
      ' 3  172.16.0.1 (172.16.0.1)  10.123 ms  10.045 ms  9.987 ms\n' +
      ' 4  * * *\n' +
      ' 5  142.250.199.100 (' +
      target +
      ')  12.345 ms  12.234 ms  12.123 ms'
    );
  };

  // ── Helpers ───────────────────────────────
  function err(msg) {
    return '<span class="sim-err">' + msg + '</span>';
  }
  function padLeft(str, len) {
    while (str.length < len) str = ' ' + str;
    return str;
  }
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ── Parse & Execute ───────────────────────
  function execute(input) {
    input = input.trim();
    if (!input) return '';
    cmdHistory.push(input);
    historyIndex = cmdHistory.length;

    // handle pipes (simple)
    if (input.indexOf('|') !== -1) {
      return '<span class="sim-info">Pipes are partially supported in this simulator</span>';
    }

    var parts = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
    var cmd = parts[0];
    var args = parts.slice(1);

    if (commands[cmd]) {
      return commands[cmd](args);
    }

    // sudo prefix
    if (cmd === 'sudo' && parts.length > 1) {
      var sudoCmd = parts[1];
      var sudoArgs = parts.slice(2);
      if (commands[sudoCmd]) return commands[sudoCmd](sudoArgs);
      return err(sudoCmd + ': command not found');
    }

    return err(
      cmd + ': command not found. Type "help" for available commands.',
    );
  }

  // ── UI ────────────────────────────────────
  var outputEl, inputEl, promptLabel, terminalEl;

  function init() {
    // Use existing page button
    var toggle = document.getElementById('terminalPageBtn');
    if (toggle) {
      toggle.addEventListener('click', function () {
        terminalEl.classList.toggle('open');
        if (terminalEl.classList.contains('open')) inputEl.focus();
      });
    }

    // Create terminal
    terminalEl = document.createElement('div');
    terminalEl.className = 'sim-terminal';
    terminalEl.innerHTML =
      '<div class="sim-terminal-header">' +
      '<div class="sim-terminal-dots"><span class="d-red"></span><span class="d-yel"></span><span class="d-grn"></span></div>' +
      '<span class="sim-terminal-title">user@cyberpark — bash</span>' +
      '<button class="sim-terminal-close">X</button>' +
      '</div>' +
      '<div class="sim-terminal-output" id="simOutput"></div>' +
      '<div class="sim-terminal-input-row">' +
      '<span class="sim-terminal-prompt-label" id="simPrompt"></span>' +
      '<input class="sim-terminal-input" id="simInput" type="text" autocomplete="off" spellcheck="false" />' +
      '</div>';
    document.body.appendChild(terminalEl);

    outputEl = document.getElementById('simOutput');
    inputEl = document.getElementById('simInput');
    promptLabel = document.getElementById('simPrompt');

    updatePromptLabel();

    // Welcome message
    appendOutput(
      '<span class="sim-info">Cyberpark Linux Simulator v1.0</span>',
    );
    appendOutput(
      '<span class="sim-info">Type "help" for available commands.</span>',
    );
    appendOutput('');

    // Close button
    terminalEl
      .querySelector('.sim-terminal-close')
      .addEventListener('click', function () {
        terminalEl.classList.remove('open');
      });

    // Input handler
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var cmd = inputEl.value;
        appendOutput(
          '<span class="sim-prompt">' +
            getPrompt() +
            '</span><span class="sim-cmd">' +
            escapeHtml(cmd) +
            '</span>',
        );
        var result = execute(cmd);
        if (result) appendOutput(result);
        inputEl.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          inputEl.value = cmdHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          inputEl.value = cmdHistory[historyIndex];
        } else {
          historyIndex = cmdHistory.length;
          inputEl.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        autocomplete();
      }
    });

    // Focus input on click
    terminalEl.addEventListener('click', function (e) {
      if (e.target !== inputEl) inputEl.focus();
    });
  }

  function updatePromptLabel() {
    if (promptLabel) promptLabel.textContent = getPrompt();
  }

  function appendOutput(html) {
    var div = document.createElement('div');
    div.className = 'sim-line';
    div.innerHTML = html;
    outputEl.appendChild(div);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Tab autocomplete
  function autocomplete() {
    var val = inputEl.value;
    var parts = val.split(/\s+/);
    var partial = parts[parts.length - 1] || '';
    var dir = cwd;
    var prefix = '';

    if (partial.indexOf('/') !== -1) {
      var lastSlash = partial.lastIndexOf('/');
      dir = resolvePath(partial.substring(0, lastSlash + 1));
      prefix = partial.substring(lastSlash + 1);
    } else {
      prefix = partial;
    }

    var node = getNode(dir);
    if (!node || !node.children) return;

    var matches = Object.keys(node.children).filter(function (name) {
      return name.startsWith(prefix);
    });

    if (matches.length === 1) {
      parts[parts.length - 1] =
        (partial.indexOf('/') !== -1
          ? partial.substring(0, partial.lastIndexOf('/') + 1)
          : '') + matches[0];
      var child = node.children[matches[0]];
      if (child.type === 'd') parts[parts.length - 1] += '/';
      inputEl.value = parts.join(' ');
    } else if (matches.length > 1) {
      appendOutput(
        '<span class="sim-prompt">' +
          getPrompt() +
          '</span><span class="sim-cmd">' +
          escapeHtml(val) +
          '</span>',
      );
      appendOutput(matches.join('  '));
    }
  }

  // Init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
