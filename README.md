# download http://downloads.raspberrypi.org/arch_latest.torrent
unzip ArchLinuxARM-2014.01-rpi.img.zip
diskutil unmountDisk /dev/disk3
sudo dd bs=1m if=ArchLinuxARM-2014.01-rpi.img of=/dev/rdisk3

# Log in and change root password

ssh root@IP
passwd

# Add pitv user

useradd -m -G users,audio,video,wheel,storage,optical,power,network,log,lp -s /bin/bash pitv
passwd pitv

# Update pacman package index

pacman -Syu

# Install the sudoers package

pacman -S sudo

# enable wheel group in /etc/sudoers

visudo

su pitv

# Install X

sudo pacman -S xorg-server xorg-server-utils xorg-apps xorg-xinit mesa xf86-video-fbdev xf86-video-vesa libgcrypt

# https://wiki.archlinux.org/index.php/automatic_login_to_virtual_console

sudo mkdir /etc/systemd/system/getty@tty1.service.d
sudo touch /etc/systemd/system/getty@tty1.service.d/autologin.conf

[Service]
ExecStart=
ExecStart=-/usr/bin/agetty --autologin pitv --noclear %I 38400 linux"

# https://wiki.archlinux.org/index.php/Start_X_at_Login

vi ~/.bashrc

	[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && exec startx

# Install samba client

# sudo pacman -S sambaclient
# sudo cp /etc/samba/smb.conf.default /etc/samba/smb.conf

# Set up sshfs and mount drive

sudo pacman -S sshfs
sudo mkdir /mnt/osx
sudo sshfs -o allow_other wb@192.168.0.13: /mnt/osx

# Install omx player

sudo pacman -S gcc
sudo pacman -S omxplayer

# Unmount shared drive

sudo fusermount -u /mnt/osx

# Play video!

omxplayer -o hdmi /mnt/osx/Downloads/complete/filename.avi