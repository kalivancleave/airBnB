const UploadImage = () => {

  const upload = () => {
    const url = 'https://api.cloudinary.com/v1_1/djnfjzocb/image/upload';
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const files= document.querySelector('[type=file]').files;
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('file', file);
        formData.append('upload_preset', 'docs_upload_example_us_preset');

        fetch(url, {
          method: 'POST',
          body: formData,
        })
          .then((response) => {
            return response.text();
          })
          .then((data) => {
            document.getElementById('data').innerHTML += data;
          });
      }
    })
  };

  return (
    <>
      <p className="xlargeFont redText">BROKEN DO NOT USE</p>
      <form method='post' encType='multipart/form-data'>
        <input type='file' name="files[]" multiple />
        <input type='submit' value='Upload Files' name='submit' onSubmit={() => upload()} />
      </form>
    </>
  )
}

export default UploadImage;
