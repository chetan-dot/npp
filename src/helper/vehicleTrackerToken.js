let accessToken = null;
let isRefreshing = false;

const refreshVehicleAccessToken = async () => {
  try {
    isRefreshing = true;
    const response = await fetch('https://open.iopgps.com/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appid: 'pentagon',
        time: 1747472307,
        signature: '264d33d504fbe357c3a2913256067781',
      }),
    });

    const data = await response.json();
    if (data.code === 0) {
      accessToken = data.accessToken;
    } else {
      console.error('Token API error:', data.message);
    }
  } catch (error) {
    console.error('Error refreshing token:', error.message);
  } finally {
    isRefreshing = false;
  }
};

export const getAccessToken = async () => {
  let retries = 5;
  while (!accessToken && retries > 0) {
    if (!isRefreshing) {
      await refreshVehicleAccessToken();
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    retries--;
  }
  return accessToken;
};

refreshVehicleAccessToken();
setInterval(refreshVehicleAccessToken, 2 * 60 * 60 * 1000);
