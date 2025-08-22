// API для отправки заявок
export async function sendLead(data) {
  try {
    const response = await fetch('/api/send-lead.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
}
