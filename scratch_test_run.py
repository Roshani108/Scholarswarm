import httpx
import json

client = httpx.Client(timeout=60.0)
files = {
    'resume': ('rahul_resume.pdf', open('samples/rahul_resume.pdf', 'rb'), 'application/pdf'),
    'marksheet': ('rahul_marksheet.pdf', open('samples/rahul_marksheet.pdf', 'rb'), 'application/pdf')
}
data = {
    'name': 'Rahul Sharma',
    'education_level': 'B.Tech Computer Science & Engineering',
    'cgpa': '8.2 / 10.0',
    'target_countries': 'Canada,Germany,Singapore',
    'target_degree': "Master's",
    'target_field': 'Computer Science & AI',
    'budget': 'Need full scholarship',
    'github_username': 'rahul-cse',
    'chaos_mode': 'true'
}
res = client.post('http://localhost:8000/api/swarm/start', data=data, files=files)
session_id = res.json()['session_id']
print(f"Session initialized: {session_id}")

events_count = 0
with client.stream('GET', f'http://localhost:8000/api/swarm/stream/{session_id}') as response:
    for line in response.iter_lines():
        if line.startswith('data: '):
            payload = json.loads(line[6:])
            if payload.get('status') == 'completed':
                print(">> Received completion signal from SSE stream!")
                break
            events_count += 1
            print(f"[{payload.get('timestamp')}] {payload.get('agent_name')}: {payload.get('message')[:70]}...")

state_res = client.get(f'http://localhost:8000/api/swarm/state/{session_id}')
final_state = state_res.json()
print('\n========================================')
print('        SCHOLARSWARM LIVE VERIFICATION   ')
print('========================================')
print(f"Total SSE Events Streamed: {events_count}")
print(f"Candidates Discovered:     {len(final_state.get('candidates', []))}")
print(f"Verified Opportunities:    {len(final_state.get('verified_opportunities', []))}")
print(f"Top 5 Ranked Matches:      {len(final_state.get('top_5', []))}")
print(f"Failures Self-Healed:      {final_state.get('stats', {}).get('failures_healed', 0)}")
print(f"SOP Draft Generated:       {final_state.get('sop_draft', {}).get('opportunity_title')}")
print(f"SOP Word Count:            {final_state.get('sop_draft', {}).get('word_count')} words")
print(f"Fact-Check Citations:      {len(final_state.get('sop_draft', {}).get('fact_checks', []))}")
print(f"Trust Report Confidence:   {final_state.get('trust_report', {}).get('overall_confidence')}%")
print(f"Auditor Verdict:           {final_state.get('trust_report', {}).get('auditor_verdict')}")
print('========================================')
