async function testEmail() {
  const url = 'https://email-worker.abish-23cse008.workers.dev/';
  console.log('Sending request to', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'demo_confirmation',
        fullName: 'Test Student',
        email: 'varun10vikash@gmail.com',
        phone: '1234567890',
        course: 'Test Course',
        location: 'Test Loc',
        pincode: '123456'
      })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testEmail();
