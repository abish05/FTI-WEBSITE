from PIL import Image

def process_image(input_path, output_path_png, output_path_favicon):
    # Open image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    
    # Get data
    datas = img.getdata()
    
    new_data = []
    # threshold for white
    threshold = 240
    for item in datas:
        # if pixel is near white
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # changing all white (also shades of white) to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Crop to bounding box
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Add a little padding
    width, height = img.size
    padding = 20
    padded_img = Image.new("RGBA", (width + padding*2, height + padding*2), (255, 255, 255, 0))
    padded_img.paste(img, (padding, padding))
    
    # Save the main logo
    padded_img.save(output_path_png, "PNG")
    
    # Generate favicon (square)
    size = max(width, height) + padding*2
    favicon = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    # Center the logo in the square favicon
    x_offset = (size - padded_img.width) // 2
    y_offset = (size - padded_img.height) // 2
    favicon.paste(padded_img, (x_offset, y_offset))
    
    # Save favicon
    favicon.resize((256, 256), Image.Resampling.LANCZOS).save(output_path_favicon, format="PNG")
    
if __name__ == "__main__":
    input_file = "/Users/abish/.gemini/antigravity/brain/93bae612-4cae-49e0-bdb4-002f2f8fe977/media__1779384977024.png"
    output_png = "/Volumes/RIO/VARUN VCO WEBSITE/src/assets/logo.png"
    output_favicon = "/Volumes/RIO/VARUN VCO WEBSITE/public/favicon.png"
    
    try:
        process_image(input_file, output_png, output_favicon)
        print("Success")
    except Exception as e:
        print("Error:", e)
