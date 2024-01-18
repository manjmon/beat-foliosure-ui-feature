# Require that this runs as root.
[ "$UID" -eq 0 ] || exec sudo "$0" "$@"


# Define some global variables.
working_directory="/tmp/google-chrome-installation"
repo_file="/etc/yum.repos.d/google-chrome.repo"


# Work in our working directory.
echo "Working in ${working_directory}"
mkdir -p ${working_directory}
rm -rf ${working_directory}/*
pushd ${working_directory}


# Add the official Google Chrome Centos 7 repo.
echo "Configuring the Google Chrome repo in ${repo_file}"
echo "[google-chrome]" > $repo_file
echo "name=google-chrome" >> $repo_file
echo "baseurl=http://dl.google.com/linux/chrome/rpm/stable/\$basearch" >> $repo_file
echo "enabled=1" >> $repo_file
echo "gpgcheck=1" >> $repo_file
echo "gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub" >> $repo_file
install_package

# Install the Google Chrome signing key.
yum install -y wget
wget https://dl.google.com/linux/linux_signing_key.pub
rpm --import linux_signing_key.pub

# A helper to make sure that Chrome is linked correctly
function installation_status() {
    google-chrome-stable --version > /dev/null 2>&1
    [ $? -eq 0 ]
}

# Helper function to install packages in the chroot by name (as an argument).
function install_package() {
    # We'll leave the RPMs around to avoid redownloading things.
    if [ -f "$1.rpm" ]; then
        return 0
    fi

    # Find the URL for the package.
    url=$(repoquery --repofrompath=centos7,http://mirror.centos.org/centos/7/os/`arch` \
        --repoid=centos7 -q --qf="%{location}" "$1" | \
        sed s/x86_64.rpm$/`arch`.rpm/ | \
        sed s/i686.rpm$/`arch`.rpm/g | \
        sort -u
    )

    # Download the RPM.
    wget "${url}" -O "$1.rpm"

    # Extract it.
    echo "Extracting $1..."
    rpm2cpio $1.rpm | cpio -idmv > /dev/null 2>&1
}


# Try it the old fashioned way, should work on RHEL 7.X.
echo "Attempting a direction installation with yum."
yum install -y google-chrome-stable
mv /usr/bin/google-chrome-stable /usr/bin/google-chrome 
if [ $? -eq 0 ]
then
    if installation_status; then
        # Print out the success message.
        echo "Successfully installed Google Chrome!"
        rm -rf ${working_directory}
        popd > /dev/null
        exit 0
    fi
fi
