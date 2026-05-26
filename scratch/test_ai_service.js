async function main() {
  const payload = {
    photos: [
      {
        ma_hinh_anh: "test-photo",
        url_anh: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" // a simple face photo
      }
    ],
    threshold: 0.60
  };

  console.log("Calling Python service at http://127.0.0.1:8000/api/process-album...");
  try {
    const res = await fetch("http://127.0.0.1:8000/api/process-album", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error("Error from Python service:", res.status, res.statusText);
      const txt = await res.text();
      console.error(txt);
      return;
    }

    const data = await res.json();
    console.log("Success! Groups returned:", data.groups.length);
    if (data.groups.length > 0) {
      const g = data.groups[0];
      console.log("Group name:", g.ten_nhan_vat);
      console.log("Representative avatar:", g.anh_dai_dien);
      console.log("Number of faces in group:", g.faces.length);
      if (g.faces.length > 0) {
        console.log("Face vector length:", g.faces[0].vector.length);
      }
    } else {
      console.log("No faces detected in test image.");
    }
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

main();
