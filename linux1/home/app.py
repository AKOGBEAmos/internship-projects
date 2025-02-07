from flask import Flask, request, render_template_string, redirect, url_for, send_from_directory
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Définir le répertoire pour les téléchargements
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Autoriser seulement certaines extensions de fichiers
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    images = os.listdir(app.config['UPLOAD_FOLDER'])
    images_list = ''.join([f'<li><a href="/uploads/{image}">{image}</a> <a href="/delete/{image}">[Supprimer]</a></li>' for image in images])
    return render_template_string('''
        <h1 align="center">Gestion d'Images</h1>
        <form method="post" action="/upload" enctype="multipart/form-data">
            <p align="center"><input type="file" name="file">
            <input type="submit" value="Télécharger"></p>
        </form>
        <h2 align="center">Images téléchargées :</h2>
        <ul align="center">
            {}
        </ul>
    '''.format(images_list))

@app.route('/hello', methods=['GET'])
def hello():
    try:
        name = request.args.get('name')
        print(name)
        hello_template = '''<p align="center"> Hello {} </p>'''.format(name)
        return render_template_string(hello_template)
    except:
        return render_template_string('<p align="center"> An error occured!</p>')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(url_for('index'))
    file = request.files['file']
    if file.filename == '':
        return redirect(url_for('index'))
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return redirect(url_for('index'))

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/delete/<filename>')
def delete_file(filename):
    try:
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    except FileNotFoundError:
        pass
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=False, host='127.0.0.1', port=5000)
