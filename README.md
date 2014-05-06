# download http://downloads.raspberrypi.org/arch_latest.torrent
unzip ArchLinuxARM-2014.01-rpi.img.zip
diskutil unmountDisk /dev/disk3
sudo dd bs=1m if=ArchLinuxARM-2014.01-rpi.img of=/dev/rdisk3

# Log in as root

ssh root@192.168.XXX.XXX

# Resize root partition to fill drive

http://jan.alphadev.net/post/53594241659/growing-the-rpi-root-partition

fdisk /dev/mmcblk0
d, 2
n, e, 2, enter, enter
n, l, enter, enter
w

reboot

resize2fs /dev/mmcblk0p5 

# Add pitv user

useradd -m -G users,audio,video,wheel,storage,optical,power,network,log,lp -s /bin/bash pitv
passwd pitv

# Update pacman package index

pacman -Sy
# pacman -Syu

# Install the sudoers package

pacman -S sudo

# enable wheel group in /etc/sudoers

visudo

# disable root login

vi /etc/shadow

root:x:16196::::::

# switch to new user

su pitv

# Install X

sudo pacman -S xorg-server xorg-server-utils xorg-apps xorg-xinit mesa xf86-video-fbdev xf86-video-vesa libgcrypt

# https://wiki.archlinux.org/index.php/automatic_login_to_virtual_console

sudo mkdir /etc/systemd/system/getty@tty1.service.d
sudo touch /etc/systemd/system/getty@tty1.service.d/autologin.conf
sudo vi /etc/systemd/system/getty@tty1.service.d/autologin.conf

[Service]
ExecStart=
ExecStart=-/usr/bin/agetty --autologin pitv --noclear %I 38400 linux"

# https://wiki.archlinux.org/index.php/Start_X_at_Login

vi ~/.bashrc

[[ -z $DISPLAY && $XDG_VTNR -eq 1 ]] && exec startx

function get_xserver ()
{
    case $TERM in
        xterm )
            XSERVER=$(who am i | awk '{print $NF}' | tr -d ')''(' )
            # Ane-Pieter Wieringa suggests the following alternative:
            #  I_AM=$(who am i)
            #  SERVER=${I_AM#*(}
            #  SERVER=${SERVER%*)}
            XSERVER=${XSERVER%%:*}
            ;;
            aterm | rxvt)
            # Find some code that works here. ...
            ;;
    esac
}

if [ -z ${DISPLAY:=""} ]; then
    get_xserver
    if [[ -z ${XSERVER}  || ${XSERVER} == $(hostname) ||
       ${XSERVER} == "unix" ]]; then
          DISPLAY=":0.0"          # Display on local host.
    else
       DISPLAY=${XSERVER}:0.0     # Display on remote host.
    fi
fi

export DISPLAY

# Set up sounds

sudo pacman -S alsa alsa-firmware alsa-lib alsa-plugins alsa-utils

# Fix missing libgcrypt

sudo pacman -S libgcrypt

# Install emulators

# NES

sudo pacman -S fceux

# Install samba client

# sudo pacman -S sambaclient
# sudo cp /etc/samba/smb.conf.default /etc/samba/smb.conf

# Set up sshfs and mount drive

# sudo pacman -S sshfs
# sudo mkdir /mnt/osx
# sudo sshfs -o allow_other,defer_permissions,reconnect wb@192.168.0.13: /mnt/osx

# Unmount shared drive

# sudo fusermount -u /mnt/osx

# Install omx player

# sudo pacman -S gcc
sudo pacman -S omxplayer

# Play video!

omxplayer -o hdmi /mnt/osx/Downloads/complete/filename.avi

# Install nodejs

sudo pacman install nodejs

# Install PiTv

sudo pacman -S git

cd ~
git clone http://github.com/collectivecognition/PiTV

sudo pacman -S meat

# Install emulators and ps3 controller drivers

sudo pacman -S kernel26-headers file base-devel abs
cd ~/
wget https://aur.archlinux.org/packages/re/retroarch-git/retroarch-git.tar.gz
tar -xzvmf retroarch-git.tar.gz
cd retroarch-git
makepkg -Acs

git clone git://github.com/libretro/libretro-super.git
cd libretro-super
sh libretro-fetch.sh
sh libretro-build.sh
sh libretro-install.sh

git clone https://github.com/libretro/RetroArch
cd RetroArch
./configure
make
make install

wget https://aur.archlinux.org/packages/xb/xboxdrv/xboxdrv.tar.gz
tar -xzmf xboxdrv.tar.gz
cd xboxdrv.tar.gz

sudo pacman -S xboxdrv

# Raspmc + Retropie + PS3

sudo apt-get install checkinstall libusb-dev joystick

wget http://sourceforge.net/projects/qtsixa/files/QtSixA%201.5.1/QtSixA-1.5.1-src.tar.gz
tar xfvz QtSixA-1.5.1-src.tar.gz
cd QtSixA-1.5.1/sixad
make
sudo mkdir -p /var/lib/sixad/profiles
sudo checkinstall

sudo sixad --star

sudo update-rc.d sixad defaults
reboot

# Back up image

sudo dd bs=1m if=/dev/disk3 | gzip > pitv-wip-`date +%d%m%y`.gz
