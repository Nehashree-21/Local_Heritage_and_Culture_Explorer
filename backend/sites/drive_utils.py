from googleapiclient.discovery import build
from google.oauth2 import service_account

SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
SERVICE_ACCOUNT_FILE = 'service_account.json'  # relative to project root

def list_images_from_drive(folder_id):
    """Fetch all image file links from a given Google Drive folder."""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build('drive', 'v3', credentials=credentials)

    results = service.files().list(
        q=f"'{folder_id}' in parents and mimeType contains 'image/'",
        fields="files(id, name, mimeType)"
    ).execute()

    files = results.get('files', [])
    images = []
    for file in files:
        img_url = f"https://drive.google.com/uc?export=view&id={file['id']}"
        images.append({
            "name": file["name"],
            "url": img_url
        })
    return images
