import os
import boto3

bedrock_agent = boto3.client("bedrock-agent")

KNOWLEDGE_BASE_ID = os.environ["KNOWLEDGE_BASE_ID"]
DATA_SOURCE_ID = os.environ["DATA_SOURCE_ID"]

def lambda_handler(event, context):
    print("S3 upload event:", event)

    try:
        response = bedrock_agent.start_ingestion_job(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            dataSourceId=DATA_SOURCE_ID
        )
        job_id = response["ingestionJob"]["ingestionJobId"]
        print(f"Ingestion job started: {job_id}")
        return {
            "statusCode": 200,
            "body": f"Ingestion started: {job_id}"
        }
    except Exception as e:
        print("Failed to start ingestion:", e)
        return {
            "statusCode": 500,
            "body": str(e)
        }
