#!/bin/bash
# Değişiklikleri commit'lemek ve push'lamak için bir commit mesajı alın
if [ -z "$1" ]; then
  echo "Lütfen bir commit mesajı girin."
  echo "Kullanım: ./gonder.sh \"Commit mesajınız\""
  exit 1
fi

# Değişiklikleri ekle, commit'le ve push'la
git add .
git commit -m "$1"
git push origin master

echo "Değişiklikler başarıyla GitHub'a gönderildi!"
